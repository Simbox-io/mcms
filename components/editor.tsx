'use client'
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function EditorComponent({ initialValue, onChange }: { initialValue?: string, onChange: (content: string) => void }) {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <Editor
      apiKey='uuftedge0luhbstnu8d6ubxiuq2y8gnd6yleri0s8y229w8q'
      onInit={(evt, editor) => editorRef.current = editor}
      initialValue={initialValue || ''}
      onEditorChange={handleEditorChange}
      init={{
        height: 400,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
    />
  );
}
