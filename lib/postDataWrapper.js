// This file provides safe post data helpers

// Function to sanitize a post object to ensure it has all expected properties
export function sanitizePost(post) {
  if (!post) return null;
  
  return {
    ...post,
    // Ensure status is a string with default value
    status: typeof post.status === 'string' ? post.status : 'draft',
    // Ensure other commonly used fields exist
    title: post.title || 'Untitled',
    slug: post.slug || '',
    content: post.content || '',
    createdAt: post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt || new Date().toISOString(),
    // Ensure tags is an array
    tags: Array.isArray(post.tags) ? post.tags : [],
    // Ensure author is properly structured
    author: post.author ? {
      id: post.author.id || 'unknown',
      username: post.author.username || 'unknown',
      firstName: post.author.firstName || '',
      lastName: post.author.lastName || '',
      avatar: post.author.avatar || null
    } : null
  };
}

// Hook for React components to safely use post data
export function useSafePost(post) {
  return post ? sanitizePost(post) : null;
}

// Hook for React components to safely use multiple posts
export function useSafePosts(posts) {
  if (!posts || !Array.isArray(posts)) return [];
  return posts.map(post => sanitizePost(post)).filter(Boolean);
}