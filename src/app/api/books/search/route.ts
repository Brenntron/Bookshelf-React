import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OpenLibraryWork } from '@/lib/types/index';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const limit = parseInt(searchParams.get('limit') || '20');
  const authors = searchParams.get('authors');
  const subjects = searchParams.get('subjects');
  const where: Record<string, object> = {};

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
      const url = new URL(`https://openlibrary.org/search/`);
      const fields = [
        'title',
        'author_name',
        'author_key',
        'cover_i',
        'first_publish_year',
        'isbn',
        'subject',
        'key',
        'description',
        'publish_place'
      ];

      url.searchParams.set('q', query);
      url.searchParams.set('limit', limit.toString());
      url.searchParams.set('fields', fields.join(','));

      url.search = searchParams.toString()

      const booksResponse = await axios.get(url.href)
      const books = booksResponse.data.docs.map((doc: OpenLibraryWork) => ({
        author: doc.author_key ? doc.author_key.map((key: string, index: number) => ({
          name: doc.author_name?.[index] || 'Unknown Author',
          olid: key,
        })) : [],
        cover_i: doc.cover_i || 0,
        firstPublishedYear: doc.first_publish_year || 0,
        isbn: doc.isbn || [],
        olid: doc.key.replace('/works/', ''),
        subject: doc.subject || [],
        title: doc.title || '',
      }))

      return NextResponse.json({ books });
    } catch (error) {
      console.error('Error fetching books from Open Library:', error);
      return NextResponse.json({ error });
    }
  } else {
    return NextResponse.json({ booksInDb });
  }
}
