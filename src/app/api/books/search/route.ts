import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration since external APIs may be blocked
const mockBooks = [
  {
    id: '1',
    googleBooksId: '1',
    title: 'JavaScript: The Good Parts',
    authors: ['Douglas Crockford'],
    description: 'Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad, having been developed and released in a hurry before it could be refined. This authoritative book scrapes away these bad features to reveal a subset of JavaScript that\'s more reliable, readable, and maintainable.',
    thumbnail: 'https://books.google.com/books/content?id=PXa2bby0oQ0C&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73u18CmYiWyZ4qUBPpCjnmJKjVVJQTzGWiYbkF-4G2n0Qk7mfFxBh0L9Pf3Y1QfSJZ8XiZPKkx8E1RH5qR2g',
    publishedDate: '2008-05-08',
    pageCount: 172,
    categories: ['Computers', 'Programming Languages', 'JavaScript'],
    isbn: '9780596517748'
  },
  {
    id: '2',
    googleBooksId: '2',
    title: 'Eloquent JavaScript',
    authors: ['Marijn Haverbeke'],
    description: 'A Modern Introduction to Programming. JavaScript lies at the heart of almost every modern web application, from social apps to the newest browser-based games. Though simple for beginners to pick up and play with, JavaScript is a flexible, complex language that you can use to build full-scale applications.',
    thumbnail: 'https://eloquentjavascript.net/img/cover.jpg',
    publishedDate: '2018-12-04',
    pageCount: 448,
    categories: ['Computers', 'Web Development', 'JavaScript'],
    isbn: '9781593279509'
  },
  {
    id: '3',
    googleBooksId: '3',
    title: 'You Don\'t Know JS: Up & Going',
    authors: ['Kyle Simpson'],
    description: 'It\'s easy to learn parts of JavaScript, but much harder to learn it completely—or even sufficiently—whether you\'re new to the language or have used it for years. With the "You Don\'t Know JS" book series, you\'ll get a more complete understanding of JavaScript.',
    thumbnail: 'https://github.com/getify/You-Dont-Know-JS/raw/1st-ed/up%20%26%20going/cover.jpg',
    publishedDate: '2015-04-10',
    pageCount: 88,
    categories: ['Computers', 'Programming Languages', 'JavaScript'],
    isbn: '9781491924464'
  },
  {
    id: '4',
    googleBooksId: '4',
    title: 'Clean Code',
    authors: ['Robert C. Martin'],
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn\'t have to be that way.',
    thumbnail: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
    publishedDate: '2008-08-01',
    pageCount: 464,
    categories: ['Computers', 'Software Engineering'],
    isbn: '9780132350884'
  },
  {
    id: '5',
    googleBooksId: '5',
    title: 'The Pragmatic Programmer',
    authors: ['David Thomas', 'Andrew Hunt'],
    description: 'What others in the trenches say about The Pragmatic Programmer... "The cool thing about this book is that it\'s great for keeping the programming process fresh. The book helps you to continue to grow and clearly comes from people who have been there."',
    thumbnail: 'https://m.media-amazon.com/images/I/51W1sBPO7tL._SX380_BO1,204,203,200_.jpg',
    publishedDate: '1999-10-20',
    pageCount: 352,
    categories: ['Computers', 'Software Engineering'],
    isbn: '9780201616224'
  },
  {
    id: '6',
    googleBooksId: '6',
    title: 'React: Up & Running',
    authors: ['Stoyan Stefanov'],
    description: 'Hit the ground running with React, the open-source technology from Facebook for building rich web applications fast. With this practical guide, Facebook web developer Stoyan Stefanov teaches you how to build components—React\'s basic building blocks—and organize them into maintainable, large-scale apps.',
    thumbnail: 'https://learning.oreilly.com/library/cover/9781491931813/250w/',
    publishedDate: '2016-06-07',
    pageCount: 222,
    categories: ['Computers', 'Web Development', 'React'],
    isbn: '9781491931820'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const maxResults = parseInt(searchParams.get('maxResults') || '20');
  const author = searchParams.get('author')?.toLowerCase();
  const category = searchParams.get('category')?.toLowerCase();

  try {
    // In a real environment, this would call external APIs
    // For demo purposes, we'll filter our mock data
    let filteredBooks = mockBooks;

    // Filter by query
    if (query) {
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.authors.some(a => a.toLowerCase().includes(query)) ||
        book.description.toLowerCase().includes(query) ||
        book.categories.some(c => c.toLowerCase().includes(query))
      );
    }

    // Filter by author
    if (author) {
      filteredBooks = filteredBooks.filter(book =>
        book.authors.some(a => a.toLowerCase().includes(author))
      );
    }

    // Filter by category
    if (category) {
      filteredBooks = filteredBooks.filter(book =>
        book.categories.some(c => c.toLowerCase().includes(category))
      );
    }

    // Limit results
    filteredBooks = filteredBooks.slice(0, maxResults);

    return NextResponse.json({ 
      books: filteredBooks, 
      source: 'mock-demo',
      message: 'Demo data - In production, this would connect to Google Books API and OpenLibrary'
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}