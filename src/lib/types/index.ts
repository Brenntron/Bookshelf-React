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
  cover_i: string;
  description: string;
  firstPublishedYear: string;
  isbn: string[];
  olid: string;
  placeOfPublication: string;
  subject: string[];
  title: string;
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
