import { isQuillPluginActive } from './config';

const QuillPostsPage: React.FC = () => {
  if (!isQuillPluginActive) {
    return null; // Don't render the Quill posts page if the plugin is inactive
  }

  // Add your Quill posts page content here
  return (
    <div>
      <h1>Quill Posts</h1>
      {/* Add your Quill posts list or other relevant components */}
    </div>
  );
};

export default QuillPostsPage;
