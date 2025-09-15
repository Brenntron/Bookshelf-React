export interface Book {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  thumbnail?: string;
  publishedDate?: string;
  pageCount?: number;
  categories: string[];
  isbn?: string;
  googleBooksId?: string;
}

export interface Author {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  books: string[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface UserBook {
  id: string;
  userId: string;
  bookId: string;
  status: 'want_to_read' | 'reading' | 'read';
  rating?: number;
  notes?: string;
  book?: Book;
}

// External API types
export interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

export interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items: GoogleBooksVolume[];
}

export interface SearchFilters {
  category?: string;
  author?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  sortBy?: 'relevance' | 'newest' | 'oldest';
}