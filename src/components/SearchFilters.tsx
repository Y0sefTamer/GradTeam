'use client';

import { useTransition, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

const TRACKS = [
  'All',
  'Frontend',
  'Backend',
  'AI/ML',
  'Mobile Development',
  'UI/UX Design',
  'Cybersecurity',
  'Other',
];

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentTrack = searchParams.get('track') || 'All';
  const currentSearch = searchParams.get('search') || '';

  const [searchVal, setSearchVal] = useState(currentSearch);

  useEffect(() => {
    setSearchVal(currentSearch);
  }, [currentSearch]);

  const updateParams = (newTrack: string, newSearch: string) => {
    const params = new URLSearchParams(window.location.search);
    
    if (newTrack && newTrack !== 'All') {
      params.set('track', newTrack);
    } else {
      params.delete('track');
    }

    if (newSearch) {
      params.set('search', newSearch);
    } else {
      params.delete('search');
    }

    startTransition(() => {
      router.push(`/dashboard/students?${params.toString()}`);
    });
  };

  const handleTrackChange = (track: string) => {
    updateParams(track, searchVal);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams(currentTrack, searchVal);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search members by skills (e.g. React, Node, Python)..."
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
            Updating directory...
          </div>
        )}
      </div>

      {/* Track Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {TRACKS.map((track) => {
          const isActive = currentTrack === track;
          return (
            <button
              key={track}
              onClick={() => handleTrackChange(track)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {track}
            </button>
          );
        })}
      </div>
    </div>
  );
}
