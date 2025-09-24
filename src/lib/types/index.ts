export interface Author {
  id: string;
  description?: string;
  name: string;
  olid: string;
}

export interface Book {
  id: string;
  author: Author[];
  cover_i: number;
  description: string;
  firstPublishedYear: number;
  isbn: string[];
  olid: string;
  subject: string[];
  title: string;
}

export interface OpenLibraryWork {
  author_key: string[],
  author_name: string[],
  cover_i: number;
  first_publish_year: number;
  isbn: string[],
  key: string;
  olid: string;
  title: string;
  subject: string[];
}

export interface SearchFields {
  authors?: string[];
  subjects?: string[];
  title?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
}
