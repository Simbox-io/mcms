import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';

function App() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  return (
    <div className="App">
      <Editor
        apiKey='uuftedge0luhbstnu8d6ubxiuq2y8gnd6yleri0s8y229w8q'
        init={{
          plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker tinymcespellchecker permanentpen powerpaste advcode editimage advtemplate footnotes mergetags autocorrect typography inlinecss',
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons | removeformat',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          menubar: false,
          resize: false,
          branding: false,
          skin: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide'),
          content_css: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'),
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' },
          ],
        }}
        initialValue="Welcome to TinyMCE!"
      />
      <button onClick={log}>Log editor content</button>
    </div>
  );
}

export default App;