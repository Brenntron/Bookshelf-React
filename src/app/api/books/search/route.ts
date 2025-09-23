import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const limit = parseInt(searchParams.get('limit') || '20');
  const authors = searchParams.get('authors');
  const subjects = searchParams.get('subjects');
  const where: Record<string, any> = {};

  if (subjects && subjects.trim().length > 0) {
    where.subjects = { in: subjects.split(',').map(s => s.trim()).filter(Boolean) }
  }

  if (authors && authors.length > 0) {
    where.authors = { in: authors.split(',').map(a => a.trim()).filter(Boolean) }
  }

  // If no books matching the query exist in the DB fetch from Open Library API.
  const booksInDb = await prisma.book.findMany({ where })

  if (booksInDb.length === 0) {
    try {
      const openLibraryBaseUrl = process.env.OPEN_LIBRARY_BASE_URL;

      if (!openLibraryBaseUrl) {
        throw new Error('OPEN_LIBRARY_BASE_URL is not defined');
      }

      const url = new URL(`${openLibraryBaseUrl}search/`);
      const fields = [
        'title',
        'author_name',
        'author_key',
        'first_publish_year',
        'isbn',
        'subject',
        'cover_i',
        'key',
        'description',
        'publish_place'
      ];

      url.searchParams.set('q', query);
      url.searchParams.set('limit', limit.toString());
      url.searchParams.set('fields', fields.join(','));

      url.search = searchParams.toString()

      const booksResponse = await axios.get(url.href)
      const books = booksResponse.data.docs.map((doc: any) => ({
        id: doc.key.replace('/works/', ''),
        author: doc.author_key ? doc.author_key.map((key: string, index: number) => ({
          id: key,
          name: doc.author_name?.[index] || 'Unknown Author',
          olid: key,
        })) : [],
        cover_i: doc.cover_i || '',
        description: doc.description || '',
        firstPublishedYear: doc.first_publish_year?.toString() || '',
        isbn: doc.isbn || [],
        olid: doc.key.replace('/works/', ''),
        placeOfPublication: doc.publish_place?.[0] || '',
        subject: doc.subject || [],
        title: doc.title || '',
      }))

      return NextResponse.json({ books });
    } catch (error) {
      console.error('Error fetching books from Open Library:', error);
    }
  } else {
    return booksInDb;
  }
}
