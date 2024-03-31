'use client'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function CreateButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/news/create');
  }
  return <Button size='sm' onClick={handleClick}>Create</Button>;
}

