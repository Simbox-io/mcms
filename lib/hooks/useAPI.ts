import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/utils/api';

export const useAPI = (path: string) => {
    const { data, error } = useSWR(path, fetcher, {
      refreshInterval: 10000,
    });
  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      setLoading(false);
    }, [data, error]);
  
    if (error) {
      console.error('API Error:', error);
      // Handle the error state, e.g., show an error message to the user
    }
  
    return { data: data || [], loading, error };
  };