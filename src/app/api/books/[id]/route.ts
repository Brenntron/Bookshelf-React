import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/volumes/${id}`, {
      timeout: 10000,
    });

    const book = transformGoogleBookToBook(response.data);
    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }
}

function transformGoogleBookToBook(googleBook: any) {
  const volumeInfo = googleBook.volumeInfo;
  
  // Extract ISBN
  const isbn = volumeInfo.industryIdentifiers?.find(
    (identifier: any) => identifier.type === 'ISBN_13' || identifier.type === 'ISBN_10'
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