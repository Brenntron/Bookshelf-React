'use client';

import React from 'react';
import Image from 'next/image';
import { Book, Calendar, Users, FileText } from 'lucide-react';
import { Book as BookType } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface BookCardProps {
  book: BookType;
  onAddToShelf?: (book: BookType) => void;
}

export function BookCard({ book, onAddToShelf }: BookCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-[3/4] relative bg-gray-100">
        {book.thumbnail ? (
          <Image
            src={book.thumbnail}
            alt={book.title}
            fill
            className="object-cover"
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Book className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2 text-gray-900">
            {book.title}
          </h3>
          {book.authors.length > 0 && (
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <Users size={14} />
              <span className="text-sm line-clamp-1">
                {book.authors.join(', ')}
              </span>
            </div>
          )}
        </div>

        {book.description && (
          <div className="flex items-start gap-1">
            <FileText size={14} className="mt-0.5 flex-shrink-0 text-gray-500" />
            <p className="text-sm text-gray-600 line-clamp-3">
              {book.description}
            </p>
          </div>
        )}

        <div className="space-y-2">
          {book.publishedDate && (
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar size={14} />
              <span className="text-sm">
                Published {new Date(book.publishedDate).getFullYear()}
              </span>
            </div>
          )}

          {book.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {book.categories.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                >
                  {category}
                </span>
              ))}
              {book.categories.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{book.categories.length - 3} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-gray-500">
              {book.pageCount && `${book.pageCount} pages`}
              {book.isbn && book.pageCount && ' • '}
              {book.isbn && `ISBN: ${book.isbn}`}
            </div>
          </div>

          {onAddToShelf && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddToShelf(book)}
              className="w-full mt-2"
            >
              Add to Shelf
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}