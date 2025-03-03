import { useState, useEffect } from 'react';
import { sanitizeTag } from '@/lib/tagDataWrapper';

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  // ... other state and handlers
  
  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch('/api/admin/tags');
        const data = await response.json();
        
        // Sanitize tags before setting them in state
        const sanitizedTags = data.map(sanitizeTag);
        setTags(sanitizedTags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    }
    
    fetchTags();
  }, []);
  
  // ... rest of component
} 