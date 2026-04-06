'use client'

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  CodeToggle,
  type MDXEditorMethods,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useRef } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  onImageUpload?: (file: File) => Promise<string>
  placeholder?: string
  dir?: 'rtl' | 'ltr'
}

export function RichTextEditor({
  value,
  onChange,
  onImageUpload,
  placeholder = 'ابدأ الكتابة...',
  dir = 'rtl',
}: RichTextEditorProps) {
  const editorRef = useRef<MDXEditorMethods>(null)

  const handleImageUpload = async (image: File) => {
    if (onImageUpload) {
      return await onImageUpload(image)
    }
    // Default: return a data URL
    return new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.readAsDataURL(image)
    })
  }

  return (
    <div className="border rounded-lg overflow-hidden" dir={dir}>
      <MDXEditor
        ref={editorRef}
        markdown={value}
        onChange={onChange}
        placeholder={placeholder}
        contentEditableClassName="prose prose-slate max-w-none min-h-[400px] p-4 focus:outline-none"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin({
            imageUploadHandler: handleImageUpload,
            imageAutocompleteSuggestions: [],
          }),
          tablePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'javascript' }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              javascript: 'JavaScript',
              typescript: 'TypeScript',
              python: 'Python',
              java: 'Java',
              css: 'CSS',
              html: 'HTML',
              json: 'JSON',
              bash: 'Bash',
              sql: 'SQL',
            },
          }),
          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border-b">
                <UndoRedo />
                <div className="w-px h-6 bg-slate-300 mx-1" />
                <BoldItalicUnderlineToggles />
                <div className="w-px h-6 bg-slate-300 mx-1" />
                <BlockTypeSelect />
                <div className="w-px h-6 bg-slate-300 mx-1" />
                <ListsToggle />
                <div className="w-px h-6 bg-slate-300 mx-1" />
                <CreateLink />
                <InsertImage />
                <InsertTable />
                <div className="w-px h-6 bg-slate-300 mx-1" />
                <CodeToggle />
                <InsertThematicBreak />
              </div>
            ),
          }),
        ]}
      />
    </div>
  )
}
