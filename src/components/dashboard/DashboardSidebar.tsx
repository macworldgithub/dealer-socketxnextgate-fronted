'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Zap,
  Cpu,
  BarChart3,
  Settings,
  Database,
} from 'lucide-react';

export function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Leads Pipeline',
      href: '/dashboard',
      icon: Users,
      badge: 'Active',
    },
    {
      name: 'Nextgate Feed',
      href: '#',
      icon: Zap,
      badge: 'Live',
    },
    {
      name: 'Automation Rules',
      href: '#',
      icon: Cpu,
    },
    {
      name: 'Data Ingestion',
      href: '#',
      icon: Database,
    },
    {
      name: 'Analytics & ROI',
      href: '#',
      icon: BarChart3,
    },
    {
      name: 'System Config',
      href: '#',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-black flex flex-col justify-between p-4 shrink-0 selection:bg-white selection:text-black">
      <div className="space-y-6">
        {/* Dealership Logo & Portal Name */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black shadow-lg shadow-white/10">
            <Zap className="w-5 h-5 fill-black text-black" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white block">
              Dealer Socket
            </span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
              Automation Hub
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-md shadow-white/5'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-black' : 'text-neutral-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-neutral-900 text-neutral-300 border border-white/10'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
