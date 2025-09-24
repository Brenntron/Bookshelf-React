export interface Author {
  id: string;
  description?: string;
  imageUrl?: string;
  name: string;
  olid: string;
}

export interface Book {
  id: string;
  author: Author[];
  description: string;
  firstPublishedYear: string;
  isbn: string[];
  olid: string;
  subject: string[];
  title: string;
}

export interface OpenLibraryWork {
  author_key: string[],
  author_name: string[],
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
