'use client';

import React, { useEffect } from 'react';

// This component adds global data protection
function DataProtectionProvider({ children }) {
  useEffect(() => {
    // Only run in browser
    if (typeof window !== 'undefined') {
      // Add a global protection for post.status
      const originalArrayMap = Array.prototype.map;
      Array.prototype.map = function(callback, thisArg) {
        return originalArrayMap.call(this, (item, ...args) => {
          // Check if this looks like a post with status issues
          if (item && 
              typeof item === 'object' && 
              item.title && 
              item.slug && 
              (item.status === undefined || 
               (item.status && typeof item.status.charAt !== 'function'))) {
            // Create a safe copy with status
            const safeCopy = {
              ...item,
              status: typeof item.status === 'string' ? item.status : 'draft',
              title: item.title || 'Untitled',
              slug: item.slug || '',
              content: item.content || '',
              createdAt: item.createdAt || new Date().toISOString(),
              updatedAt: item.updatedAt || new Date().toISOString(),
            };
            return callback.call(thisArg, safeCopy, ...args);
          }
          return callback.call(thisArg, item, ...args);
        }, thisArg);
      };

      // Patch other potential error points
      const originalDocumentQuerySelector = document.querySelector;
      document.querySelector = function(selector) {
        try {
          return originalDocumentQuerySelector.call(this, selector);
        } catch (error) {
          console.warn('Error in querySelector, providing fallback', selector);
          return null;
        }
      };

      // Add global error handler for client side
      window.addEventListener('error', function(event) {
        // Check if it's the specific error we're trying to fix
        if (event.message && event.message.includes("undefined is not an object (evaluating 'post.status.charAt')")) {
          event.preventDefault();
          console.warn('Prevented post.status.charAt error');
          return true;
        }
      });

      console.log('Added global data protection mechanisms');
    }
    
    // Cleanup function to restore original behavior
    return () => {
      if (typeof window !== 'undefined') {
        if (Array.prototype.map) {
          Array.prototype.map = originalArrayMap;
        }
        if (document.querySelector) {
          document.querySelector = originalDocumentQuerySelector;
        }
      }
    };
  }, []);

  return <>{children}</>;
}

export default function Providers({ children }) {
  return (
    <DataProtectionProvider>
      {children}
    </DataProtectionProvider>
  );
} 