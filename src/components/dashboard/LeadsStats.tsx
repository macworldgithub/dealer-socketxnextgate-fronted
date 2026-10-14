'use client';

import React from 'react';
import { LeadStats } from '@/types/lead';
import {
  Users,
  Sparkles,
  Workflow,
  Layers,
  PhoneCall,
} from 'lucide-react';

interface LeadsStatsProps {
  stats: LeadStats;
}

export function LeadsStats({ stats }: LeadsStatsProps) {
  const cards = [
    {
      title: 'Total Ingested Leads',
      value: stats.total,
      subtitle: 'Across carsales, SMS & Email',
      icon: Users,
      badge: 'Live',
    },
    {
      title: 'New Showroom Enquiries',
      value: stats.newLeads,
      subtitle: 'Awaiting sales rep action',
      icon: Sparkles,
      highlight: true,
    },
    {
      title: 'Multi-Vehicle Enquiries',
      value: stats.multiEnquiriesCount,
      subtitle: 'Customers with 2+ car leads',
      icon: Layers,
    },
    {
      title: 'Contacted Prospects',
      value: stats.contacted,
      subtitle: 'Active conversations',
      icon: PhoneCall,
    },
    {
      title: 'In Pipeline',
      value: stats.inProgress,
      subtitle: 'Negotiation & Test Drives',
      icon: Workflow,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`relative rounded-xl border bg-white p-4.5 transition-all duration-200 shadow-xs hover:shadow-md hover:border-slate-300 group
              ${card.highlight ? 'border-blue-200 ring-1 ring-blue-500/10' : 'border-slate-200/90'}
            `}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-500 tracking-tight">
                {card.title}
              </span>
              <div
                className={`p-2 rounded-lg ${
                  card.highlight
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-slate-50 text-slate-600 border border-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </span>
                {card.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
