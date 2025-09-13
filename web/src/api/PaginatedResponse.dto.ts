// src/Dto/PaginatedResponse.dto.ts

/**
 * Represents a generic paginated response structure from an API.
 * @template T The type of the data items in the array.
 */
export interface PaginatedResponse<T> {
  data: T[]; // The array of items for the current page
  total: number; // The total number of items across all pages
  page: number; // The current page number (1-indexed)
  perPage: number; // The number of items per page
  lastPage: number; // The total number of available pages
}
