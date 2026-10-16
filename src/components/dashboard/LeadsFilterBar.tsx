'use client';

import React from 'react';
import { LeadFilterOptions } from '@/types/lead';
import { Search, Plus, Zap, X, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LeadsFilterBarProps {
  filters: LeadFilterOptions;
  onFilterChange: (newFilters: LeadFilterOptions) => void;
  onOpenNewLeadModal: () => void;
  onSimulateIngest: () => void;
  isSimulating?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const STAGE_TABS: { label: string; value: string }[] = [
  { label: 'All Leads', value: 'all' },
  { label: 'New', value: 'New' },
  { label: 'Contacted', value: 'Contacted' },
  { label: 'Test Drive', value: 'Test Drive' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Closed Won', value: 'Won' },
];

export function LeadsFilterBar({
  filters,
  onFilterChange,
  onOpenNewLeadModal,
  onSimulateIngest,
  isSimulating = false,
  onRefresh,
  isRefreshing = false,
}: LeadsFilterBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStageChange = (stage: string) => {
    onFilterChange({ ...filters, stage });
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      source: e.target.value,
    });
  };

  const handleResetFilters = () => {
    onFilterChange({
      search: '',
      stage: 'all',
      source: 'all',
      dealer: 'all',
    });
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    (filters.stage && filters.stage !== 'all') ||
    (filters.source && filters.source !== 'all');

  return (
    <div className="space-y-4">
      {/* Top Row: Search, Source Select & Action CTAs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            id="leads-search-input"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search by customer, phone, XPeng model, stock #, or source..."
            className="w-full pl-10 pr-8 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 shadow-2xs transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Source Select */}
          <select
            value={filters.source || 'all'}
            onChange={handleSourceChange}
            className="bg-white border border-slate-300 text-xs font-medium text-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-900 cursor-pointer shadow-2xs"
          >
            <option value="all">All Lead Sources</option>
            <option value="carsales">carsales</option>
            <option value="SMS connect">SMS connect</option>
            <option value="Email">Email</option>
            <option value="Walk-In">Walk-In</option>
          </select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Reset Filters
            </Button>
          )}

          {/* Refresh Leads Button */}
          {onRefresh && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRefresh}
              isLoading={isRefreshing}
              leftIcon={
                <RotateCw
                  className={`w-3.5 h-3.5 text-slate-700 ${
                    isRefreshing ? 'animate-spin' : ''
                  }`}
                />
              }
              className="text-xs font-semibold border-slate-300"
              title="Refresh leads from Nexgate API"
            >
              Refresh
            </Button>
          )}

          {/* Simulate Ingest Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onSimulateIngest}
            isLoading={isSimulating}
            leftIcon={<Zap className="w-3.5 h-3.5 text-slate-700" />}
            className="text-xs font-semibold border-slate-300"
            title="Simulates incoming Nextgate / Carsales webhook"
          >
            Simulate Ingest
          </Button>

          {/* Create Lead Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenNewLeadModal}
            leftIcon={<Plus className="w-4 h-4 text-white" />}
            className="text-xs font-semibold"
          >
            Create Lead
          </Button>
        </div>
      </div>

      {/* Bottom Row: Stage Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {STAGE_TABS.map((tab) => {
          const isActive = (filters.stage || 'all') === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleStageChange(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
