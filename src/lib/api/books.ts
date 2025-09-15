import axios from 'axios';
import { GoogleBooksResponse, GoogleBooksVolume, Book, SearchFilters } from '@/lib/types';

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1';
const OPENLIBRARY_BASE_URL = 'https://openlibrary.org';

// Google Books API service
export class GoogleBooksService {
  private static instance: GoogleBooksService;
  private apiKey?: string;

  private constructor() {
    this.apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  }

  public static getInstance(): GoogleBooksService {
    if (!GoogleBooksService.instance) {
      GoogleBooksService.instance = new GoogleBooksService();
    }
    return GoogleBooksService.instance;
  }

  private buildSearchQuery(query: string, filters?: SearchFilters): string {
    let searchQuery = query;

    if (filters?.author) {
      searchQuery += `+inauthor:${filters.author}`;
    }
    
    if (filters?.category) {
      searchQuery += `+subject:${filters.category}`;
    }

    return encodeURIComponent(searchQuery);
  }

  private buildRequestUrl(endpoint: string, params: Record<string, string>): string {
    const url = new URL(`${GOOGLE_BOOKS_BASE_URL}${endpoint}`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });

    if (this.apiKey) {
      url.searchParams.set('key', this.apiKey);
    }

    return url.toString();
  }

  public async searchBooks(
    query: string, 
    maxResults: number = 20, 
    startIndex: number = 0,
    filters?: SearchFilters
  ): Promise<Book[]> {
    try {
      const searchQuery = this.buildSearchQuery(query, filters);
      const orderBy = filters?.sortBy === 'newest' ? 'newest' : 'relevance';
      
      const url = this.buildRequestUrl('/volumes', {
        q: searchQuery,
        maxResults: maxResults.toString(),
        startIndex: startIndex.toString(),
        orderBy,
        printType: 'books'
      });

      const response = await axios.get<GoogleBooksResponse>(url);
      
      if (!response.data.items) {
        return [];
      }

      return response.data.items.map(this.transformGoogleBookToBook);
    } catch (error) {
      console.error('Error searching books:', error);
      throw new Error('Failed to search books');
    }
  }

  public async getBookById(googleBooksId: string): Promise<Book | null> {
    try {
      const url = this.buildRequestUrl(`/volumes/${googleBooksId}`, {});
      const response = await axios.get<GoogleBooksVolume>(url);
      
      return this.transformGoogleBookToBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
      return null;
    }
  }

  private transformGoogleBookToBook(googleBook: GoogleBooksVolume): Book {
    const volumeInfo = googleBook.volumeInfo;
    
    // Extract ISBN
    const isbn = volumeInfo.industryIdentifiers?.find(
      identifier => identifier.type === 'ISBN_13' || identifier.type === 'ISBN_10'
    )?.identifier;

    return {
      id: googleBook.id,
      googleBooksId: googleBook.id,
      title: volumeInfo.title,
      authors: volumeInfo.authors || [],
      description: volumeInfo.description,
      thumbnail: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail,
      publishedDate: volumeInfo.publishedDate,
      pageCount: volumeInfo.pageCount,
      categories: volumeInfo.categories || [],
      isbn
    };
  }
}

// OpenLibrary API service (as backup/alternative)
export class OpenLibraryService {
  private static instance: OpenLibraryService;

  private constructor() {}

  public static getInstance(): OpenLibraryService {
    if (!OpenLibraryService.instance) {
      OpenLibraryService.instance = new OpenLibraryService();
    }
    return OpenLibraryService.instance;
  }

  public async searchBooks(query: string, limit: number = 20): Promise<Book[]> {
    try {
      const response = await axios.get(`${OPENLIBRARY_BASE_URL}/search.json`, {
        params: {
          q: query,
          limit,
          fields: 'key,title,author_name,first_publish_year,isbn,cover_i,subject'
        }
      });

      return response.data.docs.map(this.transformOpenLibraryToBook);
    } catch (error) {
      console.error('Error searching OpenLibrary:', error);
      throw new Error('Failed to search OpenLibrary');
    }
  }

  private transformOpenLibraryToBook(openLibraryBook: {
    key?: string;
    title?: string;
    author_name?: string[];
    first_publish_year?: number;
    isbn?: string[];
    cover_i?: number;
    subject?: string[];
  }): Book {
    return {
      id: openLibraryBook.key?.replace('/works/', '') || '',
      title: openLibraryBook.title || '',
      authors: openLibraryBook.author_name || [],
      description: undefined,
      thumbnail: openLibraryBook.cover_i 
        ? `https://covers.openlibrary.org/b/id/${openLibraryBook.cover_i}-M.jpg`
        : undefined,
      publishedDate: openLibraryBook.first_publish_year?.toString(),
      pageCount: undefined,
      categories: openLibraryBook.subject?.slice(0, 5) || [],
      isbn: openLibraryBook.isbn?.[0]
    };
  }
}

// Combined book service
export class BookApiService {
  private googleBooks = GoogleBooksService.getInstance();
  private openLibrary = OpenLibraryService.getInstance();

  public async searchBooks(
    query: string,
    maxResults: number = 20,
    startIndex: number = 0,
    filters?: SearchFilters
  ): Promise<Book[]> {
    try {
      // Primary: try Google Books API
      return await this.googleBooks.searchBooks(query, maxResults, startIndex, filters);
    } catch (error) {
      console.warn('Google Books API failed, trying OpenLibrary:', error);
      
      try {
        // Fallback: try OpenLibrary API
        return await this.openLibrary.searchBooks(query, maxResults);
      } catch (fallbackError) {
        console.error('Both APIs failed:', fallbackError);
        throw new Error('All book search services are unavailable');
      }
    }
  }

  public async getBookById(id: string): Promise<Book | null> {
    try {
      return await this.googleBooks.getBookById(id);
    } catch (error) {
      console.error('Error fetching book by ID:', error);
      return null;
    }
  }
}

export const bookApiService = new BookApiService();