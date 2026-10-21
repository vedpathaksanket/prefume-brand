/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search } from 'lucide-react';
import { FragranceCategory } from '../types/perfume';

interface CategoryFilterProps {
  categories: FragranceCategory[];
  activeCategory: FragranceCategory;
  onSelectCategory: (cat: FragranceCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeNoteFilter: string | null;
  onClearNoteFilter: () => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  activeNoteFilter,
  onClearNoteFilter,
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/[0.08]">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
        {categories.map((category) => {
          const isActive = activeCategory === category && !activeNoteFilter;
          return (
            <button
              key={category}
              onClick={() => {
                if (activeNoteFilter) onClearNoteFilter();
                onSelectCategory(category);
              }}
              className={`px-4 py-2 rounded-full text-xs tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer font-medium ${
                isActive
                  ? 'bg-[#d4af37] text-[#08090d] shadow-lg shadow-[#d4af37]/20 font-semibold'
                  : 'text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Scent Note Search & Active Pyramid Note Indicator */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {activeNoteFilter && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-xs text-[#f3e5ab]">
            <span>Note: <strong className="text-white">{activeNoteFilter}</strong></span>
            <button
              onClick={onClearNoteFilter}
              className="text-[#d4af37] hover:text-white ml-1 cursor-pointer"
              title="Clear active note filter"
            >
              ✕
            </button>
          </div>
        )}

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search note (e.g. Oud, Rose, Amber)..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#d4af37]/60 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
