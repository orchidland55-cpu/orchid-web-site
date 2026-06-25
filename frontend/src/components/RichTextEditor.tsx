import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Link2, Image as ImageIcon,
  Quote, Palette, Undo2, Redo2,
  Maximize2, Minimize2, X, Tag,
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

// ✅ NOUVEAU : état du panneau alt inline
interface PendingAlt {
  img: HTMLImageElement;
  value: string;
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
  // ✅ NOUVEAU : ref pour l'input alt (focus auto)
  const altInputRef   = useRef<HTMLInputElement>(null);

  const savedRangeRef = useRef<Range | null>(null);
  const lastValueRef  = useRef<string>(value ?? "");
  const isFocusedRef  = useRef(false);

  // ── State ─────────────────────────────────────────────────────────────────
  const [isUploading,  setIsUploading]  = useState(false);
  const [uploadError,  setUploadError]  = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordStats,    setWordStats]    = useState(() => countWords(value ?? ""));

  // ✅ NOUVEAU : panneau alt inline — null = caché, objet = visible
  const [pendingAlt, setPendingAlt] = useState<PendingAlt | null>(null);

  const [fmt, setFmt] = useState({
    bold: false, italic: false, underline: false, strikeThrough: false,
    justifyLeft: true, justifyCenter: false, justifyRight: false,
    insertUnorderedList: false, insertOrderedList: false,
    blockquote: false,
  });

  // Hydratation initiale — une seule fois au mount
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const incoming = value ?? "";
    if (incoming) {
      el.innerHTML = incoming;
      lastValueRef.current = incoming;
      setWordStats(countWords(incoming));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync si la valeur change depuis l'extérieur (hors focus)
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

  // ✅ NOUVEAU : focus auto sur l'input alt quand le panneau apparaît
  useEffect(() => {
    if (pendingAlt) {
      // Petit délai pour laisser le DOM se mettre à jour
      setTimeout(() => altInputRef.current?.focus(), 50);
    }
  }, [pendingAlt]);

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
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // ✅ Escape ferme d'abord le panneau alt si ouvert
        if (pendingAlt) {
          confirmAlt(pendingAlt.value);
          return;
        }
        if (isFullscreen) setIsFullscreen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isFullscreen, pendingAlt]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── emitChange ────────────────────────────────────────────────────────────

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    lastValueRef.current = html;
    onChange(html);
    setWordStats(countWords(html));
  }, [onChange]);

  // ── execCmd ───────────────────────────────────────────────────────────────

  const execCmd = useCallback((command: string, val?: string) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    restoreRange(savedRangeRef.current);
    document.execCommand(command, false, val ?? undefined);
    emitChange();
  }, [emitChange]);

  // ── Toggle blockquote ──────────────────────────────────────────────────────

  const toggleBlockquote = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    restoreRange(savedRangeRef.current);
    if (isInsideBlockquote()) {
      document.execCommand("formatBlock", false, "p");
    } else {
      document.execCommand("formatBlock", false, "blockquote");
    }
    emitChange();
  }, [emitChange]);

  // ── Listes ────────────────────────────────────────────────────────────────

  const execList = useCallback((command: "insertUnorderedList" | "insertOrderedList") => {
    const el = editorRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    restoreRange(savedRangeRef.current);

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (range.collapsed) {
        const parent = range.commonAncestorContainer;
        const textContent = (parent.nodeType === Node.TEXT_NODE ? parent : (parent as Element)).textContent ?? "";
        if (textContent.trim() === "") {
          document.execCommand("insertText", false, "\u200B");
        }
      }
    }

    document.execCommand(command, false, undefined);
    emitChange();
  }, [emitChange]);

  // ── Couleur ───────────────────────────────────────────────────────────────

  const handleColor = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const range = saveRange(el);
    const color = prompt("Couleur du texte (ex: #ff0000, red, rgb(255,0,0)) :");
    if (!color) return;
    el.focus({ preventScroll: true });
    restoreRange(range);
    document.execCommand("foreColor", false, color);
    emitChange();
  }, [emitChange]);

  // ── Lien ──────────────────────────────────────────────────────────────────

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

  // ✅ NOUVEAU : génère l'alt depuis le nom du fichier
  const generateAltFromFilename = (filename: string): string => {
    return filename
      .replace(/\.[^/.]+$/, "")   // retire l'extension
      .replace(/[-_]/g, " ")      // remplace - et _ par des espaces
      .replace(/\s+/g, " ")       // nettoie les espaces multiples
      .trim();
  };

  // ✅ NOUVEAU : confirme l'alt et ferme le panneau
  // Appelé par "Valider", "Passer", ou Escape
  const confirmAlt = useCallback((altValue: string) => {
    if (!pendingAlt) return;
    // Met à jour l'alt sur l'élément img déjà dans le DOM
    pendingAlt.img.alt = altValue.trim();
    setPendingAlt(null);
    // Émet le HTML mis à jour avec le bon alt
    emitChange();
  }, [pendingAlt, emitChange]);

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
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const s = window.getSelection();
        s?.removeAllRanges();
        s?.addRange(range);
      }

      // ✅ MODIFIÉ : on génère l'alt auto depuis le nom du fichier
      const autoAlt = generateAltFromFilename(file.name);

      const img = document.createElement("img");
      img.src = result.url;
      img.className = "rich-img";
      img.alt = autoAlt; // alt auto dès l'insertion

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

      // emitChange d'abord pour que le parent ait le HTML avec l'alt auto
      emitChange();

      // ✅ NOUVEAU : ouvre le panneau alt inline pour que l'utilisateur
      // puisse confirmer ou modifier — sans bloquer l'UI
      setPendingAlt({ img, value: autoAlt });

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
        e.preventDefault();
        if (editorRef.current) {
          savedRangeRef.current = saveRange(editorRef.current);
        }
        onAction();
      }}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );

  // ── Rendu toolbar ─────────────────────────────────────────────────────────

  const renderToolbar = () => (
    <div className="border-b border-border p-2 bg-card flex-shrink-0">
      <div className="flex flex-wrap items-center gap-0.5">

        <ToolBtn icon={Undo2} title="Annuler (Ctrl+Z)"        active={false} onAction={() => execCmd("undo")} />
        <ToolBtn icon={Redo2} title="Rétablir (Ctrl+Shift+Z)" active={false} onAction={() => execCmd("redo")} />
        <Divider />

        <select
          className="h-8 px-1.5 text-xs border border-border rounded-md bg-background cursor-pointer flex-shrink-0"
          title="Style de paragraphe"
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

        <ToolBtn icon={Bold}          title="Gras (Ctrl+B)"     active={fmt.bold}          onAction={() => execCmd("bold")} />
        <ToolBtn icon={Italic}        title="Italique (Ctrl+I)" active={fmt.italic}        onAction={() => execCmd("italic")} />
        <ToolBtn icon={Underline}     title="Souligné (Ctrl+U)" active={fmt.underline}     onAction={() => execCmd("underline")} />
        <ToolBtn icon={Strikethrough} title="Barré"             active={fmt.strikeThrough} onAction={() => execCmd("strikeThrough")} />

        <Divider />

        <ToolBtn icon={AlignLeft}   title="Aligner à gauche" active={fmt.justifyLeft}   onAction={() => execCmd("justifyLeft")} />
        <ToolBtn icon={AlignCenter} title="Centrer"          active={fmt.justifyCenter} onAction={() => execCmd("justifyCenter")} />
        <ToolBtn icon={AlignRight}  title="Aligner à droite" active={fmt.justifyRight}  onAction={() => execCmd("justifyRight")} />

        <Divider />

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
        <ToolBtn
          icon={Quote}
          title="Citation (toggle)"
          active={fmt.blockquote}
          onAction={toggleBlockquote}
        />

        <Divider />

        <ToolBtn icon={Palette} title="Couleur du texte"  onAction={handleColor} />
        <ToolBtn icon={Link2}   title="Insérer un lien"   onAction={handleLink} />
        <ToolBtn
          icon={ImageIcon}
          title={`Insérer une image (max ${MAX_FILE_SIZE_MB} Mo)`}
          disabled={isUploading}
          onAction={() => { fileInputRef.current?.click(); }}
        />

        {isUploading && (
          <span className="text-xs text-muted-foreground animate-pulse ml-1 flex-shrink-0">
            Upload…
          </span>
        )}

        <div className="flex-1 min-w-0" />

        <button
          type="button"
          title={isFullscreen ? "Quitter le plein écran (Échap)" : "Plein écran"}
          className="p-0 h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-md hover:bg-accent transition-colors"
          onClick={() => setIsFullscreen(v => !v)}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

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

  // ✅ NOUVEAU : panneau alt inline — rendu sous la zone d'édition
  const renderAltPanel = () => {
    if (!pendingAlt) return null;
    return (
      <div className="border-t border-border bg-card px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span className="text-xs font-medium text-foreground">Texte alternatif (alt)</span>
          <span className="text-xs text-muted-foreground ml-auto">Pour le SEO et l'accessibilité</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={altInputRef}
            type="text"
            value={pendingAlt.value}
            onChange={(e) => setPendingAlt(prev => prev ? { ...prev, value: e.target.value } : null)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                confirmAlt(pendingAlt.value);
              }
              // Escape géré dans le useEffect global
            }}
            placeholder="Décrivez l'image..."
            className="flex-1 h-8 px-3 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => confirmAlt(pendingAlt.value)}
            className="h-8 px-3 text-xs rounded-md border border-border bg-background hover:bg-muted text-foreground transition-colors flex-shrink-0"
          >
            Passer
          </button>
          <button
            type="button"
            onClick={() => confirmAlt(pendingAlt.value)}
            className="h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0 font-medium"
          >
            Valider ↵
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          Généré depuis le nom du fichier · modifiable
        </p>
      </div>
    );
  };

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

        {/* ✅ NOUVEAU : panneau alt inline — apparaît après upload image */}
        {renderAltPanel()}

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