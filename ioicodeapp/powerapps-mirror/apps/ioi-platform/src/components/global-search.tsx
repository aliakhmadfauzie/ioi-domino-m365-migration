// Global Search Component - Cross-module search functionality

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  FileText,
  Folder,
  ArrowRight,
  Clock,
  Command,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useGlobalSearch } from '@/hooks/use-platform';
import { cn } from '@/lib/utils';

interface GlobalSearchProps {
  className?: string;
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, isOpen, openSearch, closeSearch, searchResults } = useGlobalSearch();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ioi-recent-searches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save search to recent
  const saveToRecent = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const updated = [searchTerm, ...recentSearches.filter((s: string) => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('ioi-recent-searches', JSON.stringify(updated));
  }, [recentSearches]);

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, openSearch, closeSearch]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleResultClick = (path: string) => {
    saveToRecent(query);
    closeSearch();
    navigate(path);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('ioi-recent-searches');
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={openSearch}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background/80 hover:bg-muted text-muted-foreground transition-colors w-full max-w-md',
          className
        )}
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left text-sm">Search forms, modules...</span>
        <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-muted border border-border rounded">
          <Command className="h-3 w-3" />
          <span>K</span>
        </kbd>
      </button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeSearch()}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search forms, modules, or submissions..."
              className="border-0 p-0 h-auto text-base focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setQuery('')}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Results */}
          <ScrollArea className="max-h-[60vh]">
            <div className="p-2">
              {/* Show recent searches if no query */}
              {!query && recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((term: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(term)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{term}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Search results */}
              {query.length >= 2 && (
                <>
                  {searchResults.length === 0 ? (
                    <div className="py-12 text-center">
                      <Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    <>
                      <div className="px-2 py-1.5 mb-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Results ({searchResults.length})
                        </span>
                      </div>
                      <AnimatePresence mode="popLayout">
                        {searchResults.map((result, index: number) => (
                          <motion.button
                            key={result.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            onClick={() => handleResultClick(result.path)}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left group"
                          >
                            <div className="p-1.5 rounded-md bg-muted">
                              {result.type === 'form' ? (
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Folder className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] shrink-0">
                                  {result.type}
                                </Badge>
                                <span className="text-sm font-medium text-foreground truncate">
                                  {result.title}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {result.description}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </>
                  )}
                </>
              )}

              {/* Prompt to type */}
              {!query && recentSearches.length === 0 && (
                <div className="py-12 text-center">
                  <Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Start typing to search</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Search forms, modules, and submissions</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border bg-muted/30">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-muted border border-border rounded text-[10px]">↵</kbd>
                <span>Select</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-muted border border-border rounded text-[10px]">↑↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-muted border border-border rounded text-[10px]">Esc</kbd>
                <span>Close</span>
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function GlobalSearchBar({ className }: GlobalSearchProps) {
  const { query, setQuery, openSearch, searchResults } = useGlobalSearch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            if (query.length >= 2) setShowDropdown(true);
          }}
          onBlur={() => {
            setTimeout(() => setShowDropdown(false), 200);
          }}
          placeholder="Search forms, modules, submissions..."
          className="pl-10 bg-white"
        />
      </div>

      {/* Dropdown results */}
      <AnimatePresence>
        {showDropdown && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <ScrollArea className="max-h-80">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              ) : (
                <div className="p-1">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        setShowDropdown(false);
                        navigate(result.path);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-muted text-left"
                    >
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {result.type}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{result.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}