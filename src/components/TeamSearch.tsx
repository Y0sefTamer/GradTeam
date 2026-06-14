'use client';

import { useTransition, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

export default function TeamSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get('search') || '';
  const [searchVal, setSearchVal] = useState(currentSearch);

  useEffect(() => {
    setSearchVal(currentSearch);
  }, [currentSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (searchVal) {
      params.set('search', searchVal);
    } else {
      params.delete('search');
    }
    startTransition(() => {
      router.push(`/dashboard/teams?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search teams by name, domain, or roles..."
          className="block w-full pl-11 pr-24 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
        >
          Search
        </button>
      </form>

      {isPending && (
        <div className="text-xs text-indigo-600 font-medium animate-pulse flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
          Updating teams...
        </div>
      )}
    </div>
  );
}
