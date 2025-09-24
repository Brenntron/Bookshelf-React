'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { openLibraryApiService } from '@/lib/api/open-library';
import { SearchFields } from '@/lib/types';
import { BookCard } from '@/components/book/BookCard';

export function BookSearch() {
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [fields, setFields] = useState<SearchFields>({});
  const [showFields, setShowFields] = useState(false);
  const { data: books, isLoading, error, isError } = useQuery({
    queryKey: ['books', searchTerm, fields],
    queryFn: () => openLibraryApiService.searchBooks(searchTerm, 20, fields),
    enabled: !!searchTerm,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchTerm(query.trim());
    }
  };

  const handleFieldChange = (key: keyof SearchFields, value: string) => {
    setFields(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFields = () => {
    setFields({});
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <BookOpen size={32} />
          <h1 className='text-3x1 font-bold'>Bookshelf</h1>
        </div>
        <p className="text-gray-600">Discover authors and shelve books!</p>
      </div>

      <form onSubmit={handleSearch} className='flex gap-2'>
        <div className="flex-1 relative">
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
          <Input
            type="text"
            placeholder="Search by authors, title or subjects."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p1-10"
          />
        </div>
        <Button type="submit" disabled={!query.trim()}>
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFields(!showFields)}
        >
          <Filter size={16} />
        </Button>
      </form>

      {showFields && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className='font-medium'>SearchFields</h3>
            <Button variant='ghost' size='sm' onClick={clearFields}>
              Clear All
            </Button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mdb-1'>
                Authors
              </label>
              <Input
                placeholder="Author names"
                value={fields.authors || ''}
                onChange={(e) => handleFieldChange('authors', e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mdb-1'>
                Subjects
              </label>
              <Input
                placeholder="Subjects"
                value={fields.subjects || ''}
                onChange={(e) => handleFieldChange('subjects', e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mdb-1'>
                Title
              </label>
              <Input
                placeholder="Title"
                value={fields.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className='space-y-4'>
        {isLoading && (
          <div className='text-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-2 text-gray-600'>Searching books...</p>
          </div>
        )}

        {isError && (
          <div className='text-center py-8'>
            <p className='text-red-600'>
              {error instanceof Error ? error.message : 'An error occurred while searching.'}
            </p>
          </div>
        )}

        {books && books.length > 0 && (
          <div>
            <p className='text-gray-600 mb-4'>
              Found {books.length} books for &quot;{searchTerm}&quot;!
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {books.map((book) => (
                <BookCard key={book.id || book.olid} book={book} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
