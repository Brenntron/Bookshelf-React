'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { bookApiService } from '@/lib/api/books';
import { SearchFilters } from '@/lib/types';
import { BookCard } from '@/components/book/BookCard';

export function BookSearch() {
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const { data: books, isLoading, error, isError } = useQuery({
    queryKey: ['books', searchTerm, filters],
    queryFn: () => bookApiService.searchBooks(searchTerm, 20, 0, filters),
    enabled: !!searchTerm,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchTerm(query.trim());
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <BookOpen size={32} />
          <h1 className="text-3xl font-bold">Bookshelf</h1>
        </div>
        <p className="text-gray-600">Discover books and authors from around the world</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search for books, authors, or topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={!query.trim()}>
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
        </Button>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <Input
                placeholder="Author name"
                value={filters.author || ''}
                onChange={(e) => handleFilterChange('author', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Input
                placeholder="Fiction, Science, etc."
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort by
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                value={filters.sortBy || 'relevance'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as 'relevance' | 'newest' | 'oldest')}
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Searching books...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-8">
            <p className="text-red-600">
              {error instanceof Error ? error.message : 'An error occurred while searching'}
            </p>
          </div>
        )}

        {books && books.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-gray-600">No books found for &quot;{searchTerm}&quot;</p>
          </div>
        )}

        {books && books.length > 0 && (
          <div>
            <p className="text-gray-600 mb-4">
              Found {books.length} books for &quot;{searchTerm}&quot;
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}