import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserProfile() {
  return (
    <Avatar>
      <AvatarImage src="/avatar.png" alt="User avatar" />
      <AvatarFallback>UI</AvatarFallback>
    </Avatar>
  );
}