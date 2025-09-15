import axios from 'axios';
import { Book, SearchFilters } from '@/lib/types';

// Combined book service using internal API routes
export class BookApiService {
  public async searchBooks(
    query: string,
    maxResults: number = 20,
    startIndex: number = 0,
    filters?: SearchFilters
  ): Promise<Book[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        maxResults: maxResults.toString(),
        startIndex: startIndex.toString(),
      });

      if (filters?.author) {
        params.set('author', filters.author);
      }
      
      if (filters?.category) {
        params.set('category', filters.category);
      }

      if (filters?.sortBy) {
        params.set('sortBy', filters.sortBy);
      }

      const response = await axios.get(`/api/books/search?${params.toString()}`);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data.books || [];
    } catch (error) {
      console.error('Error searching books:', error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to search books');
    }
  }

  public async getBookById(id: string): Promise<Book | null> {
    try {
      const response = await axios.get(`/api/books/${id}`);
      return response.data.book || null;
    } catch (error) {
      console.error('Error fetching book by ID:', error);
      return null;
    }
  }
}

export const bookApiService = new BookApiService();