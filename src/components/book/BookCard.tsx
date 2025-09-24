'use client';

import React from 'react';
// import Image from 'next/image';
// import { Book, Calendar, Users, FileText } from 'lucide-react';
import { Book, Calendar, Users } from 'lucide-react';
import { Book as BookType } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface BookCardProps {
  book: BookType;
  onAddToShelf?: (book: BookType) => void;
}

export function BookCard({ book, onAddToShelf }: BookCardProps) {
  // const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  //   const target = e.target as HTMLImageElement;
  //   target.style.display = 'none';
  // };

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200'>
      <div className='aspect-[3/4] relative bg-gray-100'>
        <div className='w-full h-full flex items-center justify-center'>
          <Book className='w-16 h-16 text-gray-400' />
        </div>
      </div>

      <div className='p4 space-y-3'>
        <div>
          <h3 className='font-semibold text-lg line-clamp-2 text-gray-900'>
            {book.title}
          </h3>
          {book.author.length > 0 && (
            <div className='flex items-center gap-1 text-gray-600 mt-1'>
              <Users size={14} />
              <span className='text-sm line-clamp-1'>
                {book.author.map(a => a.name).join(', ')}
              </span>
            </div>
          )}
        </div>

        <div className='space-y-2'>
          {book.firstPublishedYear && (
            <div className='flex items-center gap-1 text-gray-500'>
              <Calendar size={14} />
              <span className='text-sm'>
                Published {book.firstPublishedYear}
              </span>
            </div>
          )}

          {book.subject.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {book.subject.slice(0, 3).map((subject, index) => (
                <span
                  key={index}
                  className='inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full'
                >
                  {subject}
                </span>
              ))}
              {book.subject.length > 3 && (
                <span className='text-xs text-gray-500'>
                  +{book.subject.length - 3} more
                </span>
              )}
            </div>
          )}

          <div className='flex items-center justify-between pt-2'>
            <div className='text-xs text-gray-500'>
              {book.isbn && `ISBN: ${book.isbn}`}
            </div>
          </div>

          {onAddToShelf && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => onAddToShelf(book)}
              className='w-full mt-2'
            >
              Add to Shelf
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
