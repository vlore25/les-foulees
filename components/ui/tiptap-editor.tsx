"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered } from 'lucide-react';
import { useEffect } from 'react';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="border border-slate-200 bg-slate-50 p-2 flex gap-2 flex-wrap items-center">
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleBold().run()} 
        className={`p-2 rounded transition-colors ${editor.isActive('bold') ? 'bg-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleItalic().run()} 
        className={`p-2 rounded transition-colors ${editor.isActive('italic') ? 'bg-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleStrikethrough().run()} 
        className={`p-2 rounded transition-colors ${editor.isActive('strike') ? 'bg-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-slate-300 mx-2" />
      
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
        className={`p-2 rounded font-bold flex items-center transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
        className={`p-2 rounded font-bold flex items-center transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().setParagraph().run()} 
        className={`p-2 px-3 text-sm font-medium rounded transition-colors ${editor.isActive('paragraph') ? 'bg-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
      >
        Normal
      </button>

      <div className="w-px h-6 bg-slate-300 mx-2" />
      
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleBulletList().run()} 
        className={`p-2 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
      >
        <List className="w-4 h-4" />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        className={`p-2 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-primary text-white' : 'hover:bg-slate-200 text-slate-700'}`}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
    </div>
  );
};

export function TiptapEditor({ content, onChange }: { content: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Tiptap outputs plain HTML tags. On Tailwind projects without typography plugin, we add some nested classes or let the global CSS handle it.
        class: 'focus:outline-none min-h-[400px] p-6 border border-t-0 border-slate-200 bg-white ' +
               '[&_h1]:text-3xl [&_h1]:font-black [&_h1]:mb-4 [&_h1]:mt-6 ' +
               '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 ' +
               '[&_p]:mb-4 [&_p]:leading-relaxed ' +
               '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 ' +
               '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4',
      },
    },
  });

  // Pour s'assurer que le contenu initial est bien pris en compte même s'il arrive un poil en retard (SSR/CSR)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="flex flex-col w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
