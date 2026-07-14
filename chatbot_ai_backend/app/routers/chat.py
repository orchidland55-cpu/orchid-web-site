from fastapi import APIRouter, Depends, HTTPException, Request, status
from starlette.concurrency import run_in_threadpool

from app.ai.deepseek import ask_deepseek
from app.config import settings
from app.memory.redis_memory import save_message
from app.rag.query_router import gather_search_results
from app.schemas.chat import ChatRequest, ChatResponse, ChatSource
from app.security.auth import verify_internal_token
from app.security.injection import looks_like_prompt_injection
from app.security.rate_limit import get_client_ip, is_rate_limited


router = APIRouter(prefix="/chat", tags=["chat"], dependencies=[Depends(verify_internal_token)])

# Coordonnées officielles, toujours disponibles pour le LLM même si aucune
# source pertinente n'a été retrouvée dans ChromaDB pour cette question.
ORCHID_CONTACT = (
    "Téléphone : +212 6 18 68 88 88\n"
    "Adresse : Centre d'affaire Oualid, Jbel Gueliz 10, 40010 Marrakech, Maroc\n"
    "Site web : https://www.orchidisland.immo"
)


@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest, request: Request) -> ChatResponse:
    client_ip = get_client_ip(request)
    if await is_rate_limited(client_ip):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests")

    if looks_like_prompt_injection(payload.message):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message refused")

    search_results, plan, searched_collections = gather_search_results(payload.message, payload.language)

    sources = [
        item
        for collection_name in searched_collections
        for item in search_results[collection_name]
    ]

    context_lines = [
        f"[{collection_name}] {item.content}"
        for collection_name in searched_collections
        for item in search_results[collection_name]
    ]
    context = "\n".join(context_lines) if context_lines else "Aucune source pertinente trouvée."

    answer_language = "français" if plan.language == "fr" else "English"

    await save_message(payload.session_id, "user", payload.message)

    prompt_messages = [
        {
            "role": "system",
            "content": (
                f"Tu es l'assistant OrchidIsland. Réponds en {answer_language} de façon concise et utile. "
                "Base-toi d'abord sur les sources fournies. Si l'information manque, dis-le clairement. "
                "Si plusieurs sources se contredisent, signale-le et privilégie la source la plus pertinente selon la question.\n\n"
                f"Coordonnées officielles d'Orchid Island Real Estate (utilise-les si on te demande comment "
                f"contacter l'agence, même si elles n'apparaissent pas dans les sources ci-dessous) :\n{ORCHID_CONTACT}\n"
                "Si on te demande une adresse email précise, dis honnêtement que tu ne l'as pas et recommande "
                "le téléphone ou le formulaire de contact du site. N'invente jamais de lien ou de coordonnée. "
                "Ne mets pas de liens markdown : écris les URLs en texte brut, sans crochets ni parenthèses."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Question utilisateur : {payload.message}\n\n"
                f"Contexte de recherche :\n{context}"
            ),
        },
    ]

    try:
        reply = await run_in_threadpool(ask_deepseek, prompt_messages, max_tokens=1200)
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="DeepSeek request failed") from exc

    await save_message(payload.session_id, "assistant", reply)

    return ChatResponse(
        session_id=payload.session_id,
        reply=reply,
        detected_language=plan.language,
        provider="deepseek",
        model=settings.deepseek_model,
        sources=[
            ChatSource(id=item.id, score=item.score, content=item.content, metadata=item.metadata)
            for item in sources
        ],
    )
