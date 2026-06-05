import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Link2, Image as ImageIcon,
  Quote, Palette, Undo2, Redo2,
  Maximize2, Minimize2, X,
} from "lucide-react";
import { uploadToCloudinary } from "@/services/cloudinary";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  uploadFolder?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

// ─────────────────────────────────────────────────────────────────────────────
// Utilitaires sélection
// ─────────────────────────────────────────────────────────────────────────────

function saveRange(editorEl: HTMLElement): Range | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  if (!editorEl.contains(range.commonAncestorContainer)) return null;
  return range.cloneRange();
}

function restoreRange(range: Range | null): boolean {
  if (!range) return false;
  const sel = window.getSelection();
  if (!sel) return false;
  sel.removeAllRanges();
  sel.addRange(range);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Détection blockquote — pour le toggle citation
// ─────────────────────────────────────────────────────────────────────────────

function isInsideBlockquote(): boolean {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return false;
  let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
  while (node) {
    if (node.nodeName === "BLOCKQUOTE") return true;
    node = (node as Element).parentElement;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Compteur de mots
// ─────────────────────────────────────────────────────────────────────────────

function countWords(html: string): { words: number; chars: number } {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return { words: 0, chars: 0 };
  return { words: text.split(" ").filter(Boolean).length, chars: text.length };
}


// ─────────────────────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────────────────────

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  uploadFolder = "orchid",
}: RichTextEditorProps) => {

  // ── Refs ──────────────────────────────────────────────────────────────────
  const editorRef     = useRef<HTMLDivElement>(null);
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const wrapperRef    = useRef<HTMLDivElement>(null);

  // Sélection sauvegardée dans onMouseDown de chaque bouton toolbar,
  // avant que le blur du contentEditable soit déclenché.
  const savedRangeRef = useRef<Range | null>(null);
  const lastValueRef  = useRef<string>(value ?? "");
  const isFocusedRef  = useRef(false);

  // ── State ─────────────────────────────────────────────────────────────────
  const [isUploading,  setIsUploading]  = useState(false);
  const [uploadError,  setUploadError]  = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordStats,    setWordStats]    = useState(() => countWords(value ?? ""));

  const [fmt, setFmt] = useState({
    bold: false, italic: false, underline: false, strikeThrough: false,
    justifyLeft: true, justifyCenter: false, justifyRight: false,
    insertUnorderedList: false, insertOrderedList: false,
    blockquote: false,
  });

  // ── Init & sync value externe ─────────────────────────────────────────────

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (lastValueRef.current === "" && value) {
      el.innerHTML = value;
      lastValueRef.current = value;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const incoming = value ?? "";
    if (incoming !== lastValueRef.current && !isFocusedRef.current) {
      el.innerHTML = incoming;
      lastValueRef.current = incoming;
      setWordStats(countWords(incoming));
    }
  }, [value]);

  // ── État actif de la toolbar ──────────────────────────────────────────────

  useEffect(() => {
    const update = () => {
      const el = editorRef.current;
      if (!el) return;
      if (!el.contains(document.activeElement) && document.activeElement !== el) return;
      setFmt({
        bold:                document.queryCommandState("bold"),
        italic:              document.queryCommandState("italic"),
        underline:           document.queryCommandState("underline"),
        strikeThrough:       document.queryCommandState("strikeThrough"),
        justifyLeft:         document.queryCommandState("justifyLeft"),
        justifyCenter:       document.queryCommandState("justifyCenter"),
        justifyRight:        document.queryCommandState("justifyRight"),
        insertUnorderedList: document.queryCommandState("insertUnorderedList"),
        insertOrderedList:   document.queryCommandState("insertOrderedList"),
        blockquote:          isInsideBlockquote(),
      });
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  // ── Escape fullscreen ─────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && isFullscreen) setIsFullscreen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isFullscreen]);



  // ── emitChange ────────────────────────────────────────────────────────────

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    lastValueRef.current = html;
    onChange(html);
    setWordStats(countWords(html));
  }, [onChange]);

  // ── execCmd : LA fonction centrale ───────────────────────────────────────
  //
  // RÈGLE ABSOLUE : cette fonction est toujours appelée en synchrone
  // depuis un onMouseDown avec e.preventDefault() déjà fait.
  // JAMAIS dans un setTimeout — cela perd la sélection restaurée.
  //
  // Séquence exacte :
  // 1. focus() sur l'éditeur
  // 2. restoreRange() avec le range sauvegardé dans onMouseDown
  // 3. execCommand()
  // 4. emitChange()

  const execCmd = useCallback((command: string, val?: string) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    restoreRange(savedRangeRef.current);
    document.execCommand(command, false, val ?? undefined);
    emitChange();
  }, [emitChange]);

  // ── Toggle blockquote : désactive si déjà actif ───────────────────────────

  const toggleBlockquote = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    restoreRange(savedRangeRef.current);
    // Si déjà dans un blockquote → repasser en paragraphe
    if (isInsideBlockquote()) {
      document.execCommand("formatBlock", false, "p");
    } else {
      document.execCommand("formatBlock", false, "blockquote");
    }
    emitChange();
  }, [emitChange]);

  // ── Listes : s'assurer qu'il y a du contenu sélectionnable ───────────────
  //
  // Problème : si le curseur est sur une ligne vide, insertUnorderedList
  // ne voit rien à convertir et semble ne rien faire.
  // Fix : si la sélection est collapsed sur un nœud vide, on insère un
  // espace insécable invisible pour donner une "ancre" à execCommand,
  // puis on exécute la commande.

  const execList = useCallback((command: "insertUnorderedList" | "insertOrderedList") => {
    const el = editorRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    restoreRange(savedRangeRef.current);

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      // Si sélection collapsed et nœud parent vide → insérer un espace pour ancrer
      if (range.collapsed) {
        const parent = range.commonAncestorContainer;
        const textContent = (parent.nodeType === Node.TEXT_NODE ? parent : (parent as Element)).textContent ?? "";
        if (textContent.trim() === "") {
          document.execCommand("insertText", false, "\u200B"); // zero-width space
        }
      }
    }

    document.execCommand(command, false, undefined);
    emitChange();
  }, [emitChange]);

  // ── Couleur — prompt() natif, synchrone, préserve la sélection ──────────
  //
  // Le prompt() est bloquant : pendant qu'il est ouvert, le navigateur
  // maintient la sélection du contentEditable intacte. C'est la méthode
  // la plus fiable pour ce cas d'usage.

  const handleColor = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    // On est dans onMouseDown donc le focus est encore dans l'éditeur.
    // On sauvegarde avant d'ouvrir le prompt.
    const range = saveRange(el);
    const color = prompt("Couleur du texte (ex: #ff0000, red, rgb(255,0,0)) :");
    if (!color) return;
    el.focus({ preventScroll: true });
    restoreRange(range);
    document.execCommand("foreColor", false, color);
    emitChange();
  }, [emitChange]);

  // ── Lien — prompt() natif, synchrone, préserve la sélection ─────────────

  const handleLink = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const range = saveRange(el);
    const url = prompt("URL du lien :");
    if (!url) return;
    el.focus({ preventScroll: true });
    restoreRange(range);
    document.execCommand("createLink", false, url);
    emitChange();
  }, [emitChange]);



  // ── Image ─────────────────────────────────────────────────────────────────

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type))
      return `Format non supporté. Utilisez JPEG, PNG, WebP ou GIF.`;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024)
      return `Fichier trop lourd (max ${MAX_FILE_SIZE_MB} Mo).`;
    return null;
  };

  const uploadAndInsert = useCallback(async (file: File) => {
    const err = validateFile(file);
    if (err) { setUploadError(err); return; }
    setUploadError(null);
    setIsUploading(true);
    try {
      const result = await uploadToCloudinary(file, uploadFolder);
      const el = editorRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      if (!restoreRange(savedRangeRef.current)) {
        // Pas de sélection sauvegardée : on va à la fin
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const s = window.getSelection();
        s?.removeAllRanges();
        s?.addRange(range);
      }
      const img = document.createElement("img");
      img.src = result.url;
      img.className = "rich-img";
      const s = window.getSelection();
      if (s && s.rangeCount > 0) {
        const range = s.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        range.setStartAfter(img);
        range.collapse(true);
        s.removeAllRanges();
        s.addRange(range);
      }
      emitChange();
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : "Échec de l'upload.");
    } finally {
      setIsUploading(false);
    }
  }, [uploadFolder, emitChange]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    await uploadAndInsert(file);
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    const images = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (!images.length) return;
    e.preventDefault();
    for (const f of images) await uploadAndInsert(f);
  }, [uploadAndInsert]);

  // ── Toolbar helpers ───────────────────────────────────────────────────────

  const Divider = () => <div className="w-px h-5 bg-border mx-0.5 flex-shrink-0" aria-hidden />;

  // ToolBtn : le onMouseDown est synchrone.
  // e.preventDefault() empêche le blur du contentEditable.
  // saveRange() capture la sélection AVANT la perte de focus.
  // L'action est exécutée immédiatement après, sans setTimeout.

  const ToolBtn = ({
    icon: Icon, title, active = false, disabled = false,
    onAction,
  }: {
    icon: React.ElementType;
    title: string;
    active?: boolean;
    disabled?: boolean;
    onAction: () => void;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      title={title}
      disabled={disabled}
      aria-pressed={active}
      className={[
        "p-0 h-8 w-8 flex-shrink-0 transition-colors",
        active ? "bg-accent text-accent-foreground ring-1 ring-accent-foreground/20" : "",
      ].join(" ")}
      onMouseDown={(e) => {
        e.preventDefault(); // ← empêche le blur
        // Sauvegarde la sélection avant toute action
        if (editorRef.current) {
          savedRangeRef.current = saveRange(editorRef.current);
        }
        onAction(); // ← synchrone, pas de setTimeout
      }}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );

  // ── Rendu toolbar ─────────────────────────────────────────────────────────
  //
  // sticky top-0 z-10 : reste visible au scroll dans la zone d'édition.
  // La zone d'édition a overflow-y-auto et une hauteur fixe, donc c'est
  // le contentEditable qui scrolle, pas la page — la toolbar ne bouge pas.

  const renderToolbar = () => (
    <div className="border-b border-border p-2 bg-card flex-shrink-0">
      <div className="flex flex-wrap items-center gap-0.5">

        {/* Undo / Redo */}
        <ToolBtn icon={Undo2} title="Annuler (Ctrl+Z)"        active={false} onAction={() => execCmd("undo")} />
        <ToolBtn icon={Redo2} title="Rétablir (Ctrl+Shift+Z)" active={false} onAction={() => execCmd("redo")} />
        <Divider />

        {/* Style */}
        <select
          className="h-8 px-1.5 text-xs border border-border rounded-md bg-background cursor-pointer flex-shrink-0"
          title="Style de paragraphe"
          defaultValue=""
          onMouseDown={() => {
            if (editorRef.current) savedRangeRef.current = saveRange(editorRef.current);
          }}
          onChange={(e) => {
            const val = e.target.value;
            e.target.value = ""; // reset visuel immédiat
            if (!val) return;
            // On a sauvegardé la sélection dans onMouseDown, on exécute directement
            const el = editorRef.current;
            if (!el) return;
            el.focus({ preventScroll: true });
            restoreRange(savedRangeRef.current);
            document.execCommand("formatBlock", false, val);
            emitChange();
          }}
        >
          <option value="">Style</option>
          <option value="h1">Titre 1</option>
          <option value="h2">Titre 2</option>
          <option value="h3">Titre 3</option>
          <option value="h4">Titre 4</option>
          <option value="p">Paragraphe</option>
        </select>

        {/* Taille */}
        <select
          className="h-8 px-1.5 text-xs border border-border rounded-md bg-background cursor-pointer flex-shrink-0"
          title="Taille de police"
          defaultValue=""
          onMouseDown={() => {
            if (editorRef.current) savedRangeRef.current = saveRange(editorRef.current);
          }}
          onChange={(e) => {
            const val = e.target.value;
            e.target.value = "";
            if (!val) return;
            const el = editorRef.current;
            if (!el) return;
            el.focus({ preventScroll: true });
            restoreRange(savedRangeRef.current);
            document.execCommand("fontSize", false, val);
            emitChange();
          }}
        >
          <option value="">Taille</option>
          <option value="1">Très petit</option>
          <option value="2">Petit</option>
          <option value="3">Normal</option>
          <option value="4">Grand</option>
          <option value="5">Très grand</option>
          <option value="6">Énorme</option>
        </select>

        <Divider />

        {/* Formatage inline */}
        <ToolBtn icon={Bold}          title="Gras (Ctrl+B)"     active={fmt.bold}         onAction={() => execCmd("bold")} />
        <ToolBtn icon={Italic}        title="Italique (Ctrl+I)" active={fmt.italic}       onAction={() => execCmd("italic")} />
        <ToolBtn icon={Underline}     title="Souligné (Ctrl+U)" active={fmt.underline}    onAction={() => execCmd("underline")} />
        <ToolBtn icon={Strikethrough} title="Barré"             active={fmt.strikeThrough} onAction={() => execCmd("strikeThrough")} />

        <Divider />

        {/* Alignement */}
        <ToolBtn icon={AlignLeft}   title="Aligner à gauche" active={fmt.justifyLeft}   onAction={() => execCmd("justifyLeft")} />
        <ToolBtn icon={AlignCenter} title="Centrer"          active={fmt.justifyCenter} onAction={() => execCmd("justifyCenter")} />
        <ToolBtn icon={AlignRight}  title="Aligner à droite" active={fmt.justifyRight}  onAction={() => execCmd("justifyRight")} />

        <Divider />

        {/* Listes — utilisent execList, pas execCmd */}
        <ToolBtn
          icon={List}
          title="Liste à puces"
          active={fmt.insertUnorderedList}
          onAction={() => execList("insertUnorderedList")}
        />
        <ToolBtn
          icon={ListOrdered}
          title="Liste numérotée"
          active={fmt.insertOrderedList}
          onAction={() => execList("insertOrderedList")}
        />

        {/* Citation — toggle intelligent */}
        <ToolBtn
          icon={Quote}
          title="Citation (toggle)"
          active={fmt.blockquote}
          onAction={toggleBlockquote}
        />

        <Divider />

        {/* Couleur — prompt() natif comme dans le composant original */}
        <ToolBtn
          icon={Palette}
          title="Couleur du texte"
          onAction={handleColor}
        />

        {/* Lien — prompt() natif comme dans le composant original */}
        <ToolBtn
          icon={Link2}
          title="Insérer un lien"
          onAction={handleLink}
        />

        {/* Image */}
        <ToolBtn
          icon={ImageIcon}
          title={`Insérer une image (max ${MAX_FILE_SIZE_MB} Mo)`}
          disabled={isUploading}
          onAction={() => {
            fileInputRef.current?.click();
          }}
        />

        {isUploading && (
          <span className="text-xs text-muted-foreground animate-pulse ml-1 flex-shrink-0">
            Upload…
          </span>
        )}

        <div className="flex-1 min-w-0" />

        {/* Plein écran */}
        <button
          type="button"
          title={isFullscreen ? "Quitter le plein écran (Échap)" : "Plein écran"}
          className="p-0 h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
          onClick={() => setIsFullscreen(v => !v)}
        >
          {isFullscreen
            ? <Minimize2 className="w-4 h-4" />
            : <Maximize2 className="w-4 h-4" />
          }
        </button>
      </div>

      {/* Erreur upload */}
      {uploadError && (
        <div className="mt-1.5 flex items-center gap-2 text-xs text-destructive bg-destructive/10 px-2.5 py-1.5 rounded-md">
          <X className="w-3 h-3 flex-shrink-0" />
          <span className="flex-1">{uploadError}</span>
          <button type="button" onClick={() => setUploadError(null)}
            className="hover:opacity-70 ml-auto" aria-label="Fermer">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );

  // ── CSS ───────────────────────────────────────────────────────────────────

  const editorCss = `
    .rich-text-content:empty:before {
      content: attr(data-placeholder);
      color: hsl(var(--muted-foreground));
      font-style: italic;
      pointer-events: none;
    }
    .rich-text-content:focus:empty:before { content: ""; }
    .rich-text-content h1 { font-size: 2em;    font-weight: 700; margin: 0.67em 0; line-height: 1.2; }
    .rich-text-content h2 { font-size: 1.5em;  font-weight: 700; margin: 0.75em 0; line-height: 1.3; }
    .rich-text-content h3 { font-size: 1.25em; font-weight: 600; margin: 0.83em 0; line-height: 1.4; }
    .rich-text-content h4 { font-size: 1.1em;  font-weight: 600; margin: 1em 0;    line-height: 1.5; }
    .rich-text-content p  { margin: 0.5em 0; line-height: 1.7; }
    .rich-text-content ul { margin: 0.5em 0; padding-left: 1.75em; list-style-type: disc; }
    .rich-text-content ol { margin: 0.5em 0; padding-left: 1.75em; list-style-type: decimal; }
    .rich-text-content li { margin: 0.25em 0; display: list-item; }
    .rich-text-content blockquote {
      border-left: 3px solid hsl(var(--border));
      padding: 0.25em 0 0.25em 1em;
      margin: 1em 0;
      font-style: italic;
      color: hsl(var(--muted-foreground));
    }
    .rich-text-content a { color: hsl(var(--primary)); text-decoration: underline; cursor: pointer; }
    .rich-text-content img, .rich-text-content img.rich-img {
      max-width: 100%; height: auto; display: block; margin: 0.75em 0; border-radius: 4px;
    }
    .rich-text-content strong, .rich-text-content b { font-weight: 700; }
    .rich-text-content em,     .rich-text-content i { font-style: italic; }
    .rich-text-content u  { text-decoration: underline; }
    .rich-text-content s, .rich-text-content strike { text-decoration: line-through; }
  `;

  // ── Rendu ─────────────────────────────────────────────────────────────────
  //
  // Architecture pour la toolbar sticky :
  // Le wrapper est un flex-col avec une hauteur max fixe.
  // La toolbar est flex-shrink-0 (ne rétrécit jamais).
  // Le contentEditable a overflow-y-auto et flex-1 → c'est LUI qui scrolle.
  // Résultat : la toolbar reste toujours visible, même en mode normal.
  //
  // En fullscreen : position fixed, même principe.

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: editorCss }} />
      <div
        ref={wrapperRef}
        className={[
          "border border-border rounded-lg bg-card flex flex-col overflow-hidden",
          isFullscreen ? "fixed inset-0 z-[9999] rounded-none border-0 bg-background" : "",
        ].join(" ")}
        style={isFullscreen ? {} : { maxHeight: "600px" }}
      >
        {/* Toolbar — toujours en haut, ne scrolle jamais */}
        {renderToolbar()}

        {/* Zone d'édition — c'est elle qui scrolle */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          className="rich-text-content flex-1 p-4 focus:outline-none overflow-y-auto"
          style={{ wordBreak: "break-word", overflowWrap: "break-word", minHeight: "200px" }}
          onInput={emitChange}
          onFocus={() => { isFocusedRef.current = true; }}
          onBlur={() => { isFocusedRef.current = false; emitChange(); }}
          onDrop={handleDrop}
          onDragOver={(e) => {
            if (Array.from(e.dataTransfer.items).some(i => i.type.startsWith("image/"))) {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }
          }}
          onKeyDown={() => { /* fermeture popovers gérée par prompt() natif */ }}
        />

        {/* Footer compteur */}
        <div className="border-t border-border px-4 py-1.5 bg-muted/20 flex justify-end flex-shrink-0">
          <span className="text-xs text-muted-foreground tabular-nums select-none">
            {wordStats.words} mot{wordStats.words !== 1 ? "s" : ""}
            {" · "}
            {wordStats.chars} car.
          </span>
        </div>

        <input
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </div>
    </>
  );
};

export default RichTextEditor;