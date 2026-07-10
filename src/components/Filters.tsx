import React, { useState } from 'react';
import { BoatType } from '../types';
import { SlidersHorizontal, Search, ShieldCheck, Heart, Sparkles, Accessibility, ChevronDown, ChevronUp } from 'lucide-react';

interface FiltersProps {
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  minCapacity: number;
  setMinCapacity: (capacity: number) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  onlyCovered: boolean;
  setOnlyCovered: (val: boolean) => void;
  onlyPetFriendly: boolean;
  setOnlyPetFriendly: (val: boolean) => void;
  onlyWheelchair: boolean;
  setOnlyWheelchair: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  maxPrice,
  setMaxPrice,
  minCapacity,
  setMinCapacity,
  selectedType,
  setSelectedType,
  onlyCovered,
  setOnlyCovered,
  onlyPetFriendly,
  setOnlyPetFriendly,
  onlyWheelchair,
  setOnlyWheelchair,
  searchQuery,
  setSearchQuery
}) => {
  const [mobileExpand, setMobileExpand] = useState(false);

  // Compute how many active filters are applied (excluding empty search query)
  const activeFiltersCount = [
    maxPrice < 1500,
    minCapacity > 1,
    onlyCovered,
    onlyPetFriendly,
    onlyWheelchair
   ].filter(Boolean).length;

  return (
    <div className="rounded-3xl border border-blue-50 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-5 transition-all">
      
      {/* Mobile Top Bar Search & Filter Trigger */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search canoes, speedboats..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-3 text-xs font-bold focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              id="input-vessel-search-mobile"
            />
            <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
          </div>
          
          <button
            type="button"
            onClick={() => setMobileExpand(!mobileExpand)}
            className={`relative flex h-10 w-10 items-center justify-center rounded-2xl border transition-all ${
              mobileExpand || activeFiltersCount > 0
                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-cyan-500 dark:bg-slate-800 dark:text-cyan-400'
                : 'border-slate-200 text-slate-500 dark:border-slate-800'
            }`}
            id="btn-toggle-filters-mobile"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white ring-2 ring-white dark:bg-cyan-500 dark:ring-slate-900">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
          <span className="font-sans text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
            Vessel Navigation Filters
          </span>
        </div>
        {activeFiltersCount > 0 && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-800 dark:bg-slate-800 dark:text-cyan-400">
            {activeFiltersCount} Active Filter{activeFiltersCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Filter Body - Always open on desktop, collapsible on mobile */}
      <div className={`${mobileExpand ? 'block mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60' : 'hidden'} md:block`}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Search Input (Desktop only) */}
          <div className="hidden md:block space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Search Vessels & Captains
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Captain Verma, Canoe, Speedster..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs font-bold focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                id="input-vessel-search"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>

          {/* Max Hourly Rate Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              <span>Max Price Rate</span>
              <span className="font-mono text-blue-600 dark:text-cyan-400 font-black">{maxPrice} INR / hour</span>
            </div>
            <div className="pt-2">
              <input
                type="range"
                min="200"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-blue-600 dark:bg-slate-800 dark:accent-cyan-500"
                id="slider-max-price"
              />
              <div className="flex justify-between text-[8px] font-extrabold text-slate-400 font-mono mt-1">
                <span>200 INR</span>
                <span>850 INR</span>
                <span>1500 INR</span>
              </div>
            </div>
          </div>

          {/* Min Capacity Counter */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Min Seating Capacity
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[1, 2, 3, 4, 6, 8].map(cap => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => setMinCapacity(cap)}
                  className={`min-w-[44px] flex-1 rounded-xl py-2 text-xs font-black transition-all border ${
                    minCapacity === cap
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-cyan-500 dark:bg-slate-800 dark:text-cyan-400 font-black scale-105 shadow-sm'
                      : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                  id={`btn-capacity-${cap}`}
                >
                  {cap === 1 ? '1 Seat' : `${cap} Pax`}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Toggles for Special Features (Covered, Pet friendly, Wheelchair) */}
        <div className="mt-4 border-t border-blue-50 pt-4 dark:border-slate-800/60">
          <div className="flex flex-wrap gap-4 items-center">
            
            <label className="flex items-center gap-2 cursor-pointer select-none py-1">
              <input
                type="checkbox"
                checked={onlyCovered}
                onChange={(e) => setOnlyCovered(e.target.checked)}
                className="h-5 w-5 md:h-4 md:w-4 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-cyan-500"
                id="chk-only-covered"
              />
              <div className="text-xs">
                <span className="font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-500" /> Covered Canopy
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none py-1">
              <input
                type="checkbox"
                checked={onlyPetFriendly}
                onChange={(e) => setOnlyPetFriendly(e.target.checked)}
                className="h-5 w-5 md:h-4 md:w-4 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-cyan-500"
                id="chk-only-pets"
              />
              <div className="text-xs">
                <span className="font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 text-rose-500" /> Pet Friendly
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none py-1">
              <input
                type="checkbox"
                checked={onlyWheelchair}
                onChange={(e) => setOnlyWheelchair(e.target.checked)}
                className="h-5 w-5 md:h-4 md:w-4 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-cyan-500"
                id="chk-only-wheelchair"
              />
              <div className="text-xs">
                <span className="font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <Accessibility className="h-3.5 w-3.5 text-emerald-500" /> Wheelchair Accessible
                </span>
              </div>
            </label>

            {/* Quick Clear Button */}
            {(searchQuery || maxPrice < 1500 || minCapacity > 1 || onlyCovered || onlyPetFriendly || onlyWheelchair) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setMaxPrice(1500);
                  setMinCapacity(1);
                  setOnlyCovered(false);
                  setOnlyPetFriendly(false);
                  setOnlyWheelchair(false);
                }}
                className="ml-auto text-xs font-black text-blue-600 hover:underline dark:text-cyan-400 py-2 px-1"
                id="btn-clear-filters"
              >
                Reset Filters
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
