import axios from 'axios';
import { Book, SearchFields } from '@/lib/types';

// Book search logic
export class OpenLibraryApiService {
  public async searchBooks(
    query: string,
    limit: number = 20,
    fields: SearchFields = {},
  ): Promise<Book[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
      });

      if (fields?.authors) {
        params.set('author', fields.authors.join(', '));
      }

      if (fields?.subjects) {
        params.set('subjects', fields.subjects.join(', '));
      }

      if (fields?.title) {
        params.set('title', fields.title);
      }

      const response = await axios.get(`/api/books/search?${params.toString()}`);

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data?.books || [];
    } catch (error) {
      console.error('Error searching books:', error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to search books');
    }
  }
}

export const openLibraryApiService = new OpenLibraryApiService();
