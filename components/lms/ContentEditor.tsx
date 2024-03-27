// components/ContentEditor.tsx
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type ContentEditorProps = {
  initialContent?: string;
  onSave: (content: string) => void;
};

export default function ContentEditor({ initialContent = '', onSave }: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = () => {
    onSave(content);
  };

  return (
    <div className="bg-white dark:bg-gray-700 dark:text-gray-100 shadow-md rounded-md p-4">
      <ReactQuill
        value={content}
        onChange={handleContentChange}
        className='mb-4 py-2 dark:bg-gray-700 dark:text-white rounded-md'
        theme="snow"
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'video'],
            ['clean'],
          ],
        }}
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
}