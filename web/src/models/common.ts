import { FieldValues, UseFormSetError } from 'react-hook-form';

export type SubmitFn<T extends FieldValues> = (data: T, onFieldError?: UseFormSetError<T>) => void;

export type PaginationDto = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type Paginated<T> = {
  items: T[];
  pagination: PaginationDto;
};
