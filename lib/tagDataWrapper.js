// This file provides safe tag data helpers

// Function to sanitize a tag object to ensure it has all expected properties
export function sanitizeTag(tag) {
  if (!tag) return null;
  
  return {
    ...tag,
    id: tag.id || `mock-${Date.now()}`,
    name: tag.name || 'Untitled',
    count: tag.count || 0,
    createdAt: tag.createdAt || new Date().toISOString(),
    updatedAt: tag.updatedAt || new Date().toISOString()
  };
}

// Hook for React components to safely use tag data
export function useSafeTag(tag) {
  return sanitizeTag(tag);
}

// Hook for React components to safely use multiple tags
export function useSafeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags.map(sanitizeTag).filter(Boolean);
} 