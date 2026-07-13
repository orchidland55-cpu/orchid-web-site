from functools import lru_cache

from openai import OpenAI

from app.config import settings


@lru_cache(maxsize=1)
def get_deepseek_client() -> OpenAI:
    if not settings.deepseek_api_key:
        raise RuntimeError("DEEPSEEK_API_KEY manque dans l'environnement.")

    return OpenAI(
        api_key=settings.deepseek_api_key,
        base_url=settings.deepseek_base_url,
    )


def ask_deepseek(
    messages: list[dict[str, str]],
    *,
    temperature: float = 0.2,
    max_tokens: int = 1024,
) -> str:
    client = get_deepseek_client()
    completion = client.chat.completions.create(
        model=settings.deepseek_model,
        messages=messages,
        temperature=temperature,
        top_p=0.95,
        max_tokens=max_tokens,
        extra_body={"chat_template_kwargs": {"thinking": False}},
        stream=False,
    )
    return completion.choices[0].message.content or ""
