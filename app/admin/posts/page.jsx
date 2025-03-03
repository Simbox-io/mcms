import { sanitizePost } from '@/lib/postDataWrapper';

// Update this component if it exists
export default function PostsPage() {
  // ...existing code
  
  // When fetching posts, sanitize them
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/admin/posts');
        const data = await response.json();
        
        // Sanitize each post to ensure consistent structure
        const sanitizedPosts = data.map(sanitizePost);
        setPosts(sanitizedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    
    fetchPosts();
  }, []);
  
  // ...rest of component
} 