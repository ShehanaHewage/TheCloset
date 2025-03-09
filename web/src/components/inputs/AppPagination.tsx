import { PaginationDto } from '@/models/common';
import { Pagination, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { PaginationContent } from '../ui/pagination';

export type AppPaginationProps = {
  pagination?: PaginationDto;
  setPage: (page: number) => void;
};

export default function AppPagination({ pagination, setPage }: AppPaginationProps) {
  if (!pagination) return null;
  return (
    <div className="mt-6 flex justify-center">
      <Pagination>
        <PaginationContent>
          {pagination.page > 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage(pagination.page - 1)} />
            </PaginationItem>
          )}

          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink isActive={pageNumber === pagination.page} onClick={() => setPage(pageNumber)}>
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {pagination.page < pagination.pages && (
            <PaginationItem>
              <PaginationNext onClick={() => setPage(pagination.page + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
