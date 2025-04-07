import { PaginationResult } from '../Interfaces/PaginationResult';
import { PaginationRequest } from '../Request/PaginationRequest';

export function paginate<T>(
  modelQuery: [T[], number | null],
  pagination: PaginationRequest,
): PaginationResult<T> {
  const [list, total] = modelQuery;
  return {
    list,
    total,
    page: pagination.page,
    limit: pagination.limit,
  };
}
