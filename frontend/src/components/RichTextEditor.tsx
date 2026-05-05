import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Link2, Image,
  Quote, Palette,
} from "lucide-react";
import { uploadToCloudinary } from "@/services/cloudinary";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  uploadFolder?: string; // "orchid/blog" ou "orchid/properties"
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  uploadFolder = "orchid",
}: RichTextEditorProps) => {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !isEditorReady) {
      editorRef.current.innerHTML = value || '';
      setIsEditorReady(true);
    }
  }, [value, isEditorReady]);

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter link URL:');
    if (url) executeCommand('createLink', url);
  };

  const insertImage = () => {
    fileInputRef.current.click();
  };

  // ✅ Upload vers Cloudinary au lieu du base64
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';

    setIsUploading(true);
    try {
      const result = await uploadToCloudinary(file, uploadFolder);
      // Insère l'URL Cloudinary dans le contenu
      executeCommand('insertImage', result.url);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const changeFontSize = (size) => executeCommand('fontSize', size);

  const changeTextColor = () => {
    const color = prompt('Enter color (e.g., #ff0000 or red):');
    if (color) executeCommand('foreColor', color);
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
  ];

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="border-b border-border p-2 bg-muted/30">
        <div className="flex flex-wrap items-center gap-1">
          <select
            onChange={(e) => changeFontSize(e.target.value)}
            className="px-2 py-1 text-xs border border-border rounded bg-background"
            title="Font Size"
          >
            <option value="">Size</option>
            <option value="1">Very Small</option>
            <option value="2">Small</option>
            <option value="3">Normal</option>
            <option value="4">Large</option>
            <option value="5">Very Large</option>
            <option value="6">Huge</option>
          </select>
          <select
            onChange={(e) => executeCommand('formatBlock', e.target.value)}
            className="px-2 py-1 text-xs border border-border rounded bg-background ml-1"
            title="Style"
          >
            <option value="">Style</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="p">Paragraph</option>
          </select>
          <div className="w-px h-6 bg-border mx-1"></div>
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => executeCommand(button.command, button.value)}
              className="p-1 h-8 w-8"
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
            </Button>
          ))}
          <div className="w-px h-6 bg-border mx-1"></div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={changeTextColor}
            className="p-1 h-8 w-8"
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertLink}
            className="p-1 h-8 w-8"
            title="Insert Link"
          >
            <Link2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertImage}
            disabled={isUploading}
            className="p-1 h-8 w-8"
            title="Insert Image"
          >
            <Image className="w-4 h-4" />
          </Button>
          {/* Indicateur d'upload */}
          {isUploading && (
            <span className="text-xs text-muted-foreground ml-2 animate-pulse">
              Uploading image...
            </span>
          )}
        </div>
      </div>

      {/* Editing Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onBlur={handleContentChange}
        className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none rich-text-content"
        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
        data-placeholder={placeholder}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          [contentEditable]:empty:before { content: attr(data-placeholder); color: hsl(var(--muted-foreground)); font-style: italic; }
          [contentEditable]:focus:before { content: none; }
          .rich-text-content h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0; }
          .rich-text-content h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
          .rich-text-content h3 { font-size: 1.25em; font-weight: bold; margin: 0.5em 0; }
          .rich-text-content h4 { font-size: 1.1em; font-weight: bold; margin: 0.5em 0; }
          .rich-text-content p { margin: 0.5em 0; line-height: 1.6; }
          .rich-text-content ul, .rich-text-content ol { margin: 0.5em 0; padding-left: 2em; }
          .rich-text-content li { margin: 0.25em 0; }
          .rich-text-content blockquote { border-left: 4px solid hsl(var(--border)); padding-left: 1em; margin: 1em 0; font-style: italic; color: hsl(var(--muted-foreground)); }
          .rich-text-content a { color: hsl(var(--primary)); text-decoration: underline; }
          .rich-text-content img { max-width: 100%; height: auto; margin: 1em 0; }
          .rich-text-content strong { font-weight: bold; }
          .rich-text-content em { font-style: italic; }
          .rich-text-content u { text-decoration: underline; }
        `
      }} />
    </div>
  );
};

export default RichTextEditor;