import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center mt-8">
      {/* Render pagination buttons */}
      {[...Array(totalPages)].map((_, index) => (
        <Button
          key={index}
          onClick={() => onPageChange(index + 1)}
          variant={currentPage === index + 1 ? 'default' : 'outline'}
        >
          {index + 1}
        </Button>
      ))}
    </div>
  );
}