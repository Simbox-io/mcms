'use strict';

/**
 * Safely formats a post status, handling undefined values
 * @param {string|null|undefined} status - The post status
 * @returns {string} Formatted status string
 */
export function formatPostStatus(status) {
  if (!status || typeof status !== 'string') return 'Draft';
  try {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  } catch (error) {
    return 'Draft';
  }
}

/**
 * Gets the appropriate CSS class for a post status
 * @param {string|null|undefined} status - The post status
 * @returns {string} CSS class string
 */
export function getPostStatusColor(status) {
  let statusValue = 'draft';
  
  if (status && typeof status === 'string') {
    try {
      statusValue = status.toLowerCase();
    } catch (error) {
      // If any error, use default
    }
  }
  
  switch (statusValue) {
    case 'published':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'archived':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  }
}

/**
 * Creates a protected post object with all required fields
 * @param {Object} post - Original post object
 * @returns {Object} Protected post object
 */
export function protectPostObject(post) {
  if (!post) return {};
  return {
    ...post,
    id: post.id || 'temp-id-' + Math.random().toString(36).substring(2, 9),
    title: post.title || 'Untitled Post',
    content: post.content || '',
    status: post.status || 'draft',
    createdAt: post.createdAt || new Date().toISOString(),
    updatedAt: post.updatedAt || new Date().toISOString(),
  };
}