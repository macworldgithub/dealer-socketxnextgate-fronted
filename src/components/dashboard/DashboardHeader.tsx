'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { SITE_CONFIG } from '@/config/site';
import { LogOut, Zap, Shield, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Organization / Dealership Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 text-sm text-slate-700">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Zap className="w-4 h-4 fill-white text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900 tracking-tight block text-sm">
              {user?.dealership || 'Xpeng Dandenong'}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
              Dealer Socket Nextgate Portal
            </span>
          </div>
        </div>
      </div>

      {/* Right: Devs Profile & Sign Out */}
      <div className="flex items-center gap-4">
        {/* User Monogram (Devs) */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'DE'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900">
              {user?.name || 'Devs'}
            </p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <Shield className="w-3 h-3 text-slate-400" />
              {user?.email || 'devs@neximet.com'}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          leftIcon={<LogOut className="w-3.5 h-3.5 text-slate-500" />}
          className="text-xs py-1.5 px-3 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
}
