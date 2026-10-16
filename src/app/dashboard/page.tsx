'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CustomerLeadRecord, LeadFilterOptions, LeadStats } from '@/types/lead';
import { leadsService } from '@/lib/api/leads.service';
import { LeadsStats } from '@/components/dashboard/LeadsStats';
import { LeadsFilterBar } from '@/components/dashboard/LeadsFilterBar';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { LeadDetailModal } from '@/components/dashboard/LeadDetailModal';
import { NewLeadModal } from '@/components/dashboard/NewLeadModal';
import { CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const [customers, setCustomers] = useState<CustomerLeadRecord[]>([]);
  const [stats, setStats] = useState<LeadStats>({
    total: 0,
    newLeads: 0,
    contacted: 0,
    inProgress: 0,
    closedWon: 0,
    multiEnquiriesCount: 0,
  });
  const [filters, setFilters] = useState<LeadFilterOptions>({
    search: '',
    stage: 'all',
    source: 'all',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerLeadRecord | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      const data = await leadsService.getCustomers({
        ...filters,
        ...(forceRefresh ? { refresh: true } : {}),
      });
      setCustomers(data);
      const allStats = await leadsService.getStats();
      setStats(allStats);
      if (forceRefresh) {
        showToast('Leads refreshed from Nexgate API');
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
      if (forceRefresh) {
        showToast('Failed to refresh leads from Nexgate');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  const handleRefresh = () => {
    loadData(true);
  };

  useEffect(() => {
    let ignore = false;
    leadsService.getCustomers(filters).then(async (data) => {
      if (!ignore) {
        setCustomers(data);
        const allStats = await leadsService.getStats();
        if (!ignore) {
          setStats(allStats);
          setIsLoading(false);
        }
      }
    }).catch((err) => {
      if (!ignore) {
        console.error('Failed to load leads:', err);
        setIsLoading(false);
      }
    });

    return () => {
      ignore = true;
    };
  }, [filters]);

  const handleUpdateStage = async (customerId: string, newStage: string) => {
    try {
      const updated = await leadsService.updateLeadStage(customerId, newStage);
      setCustomers((prev) =>
        prev.map((c) => (c.id === customerId ? updated : c))
      );
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer(updated);
      }
      const updatedStats = await leadsService.getStats();
      setStats(updatedStats);
      showToast(`Stage updated to "${newStage}" for ${updated.firstName} ${updated.lastName || ''}`);
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  };

  const handleCreateCustomer = async (
    customerData: Partial<CustomerLeadRecord>
  ) => {
    const created = await leadsService.createCustomer(customerData);
    showToast(`Lead created for ${created.firstName} ${created.lastName || ''}`);
    await loadData();
  };


  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm shadow-xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Showroom Leads Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Dealer Socket CRM ingestion stream, Xpeng Dandenong customer records, and multi-vehicle enquiry telemetry.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <LeadsStats stats={stats} />

      {/* Filter and Actions Bar */}
      <LeadsFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onOpenNewLeadModal={() => setIsNewLeadModalOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Leads Table */}
      <LeadsTable
        customers={customers}
        isLoading={isLoading}
        onSelectCustomer={setSelectedCustomer}
        onUpdateStage={handleUpdateStage}
      />

      {/* Lead Detail Inspection Modal */}
      <LeadDetailModal
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onUpdateStage={handleUpdateStage}
      />

      {/* New Lead Modal */}
      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
        onCreateCustomer={handleCreateCustomer}
      />
    </div>
  );
}
