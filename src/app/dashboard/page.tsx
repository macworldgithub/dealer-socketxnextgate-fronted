'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CustomerLeadRecord, LeadFilterOptions, LeadStats } from '@/types/lead';
import { leadsService } from '@/lib/api/leads.service';
import { LeadsStats } from '@/components/dashboard/LeadsStats';
import { LeadsFilterBar } from '@/components/dashboard/LeadsFilterBar';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { LeadDetailModal } from '@/components/dashboard/LeadDetailModal';
import { NewLeadModal } from '@/components/dashboard/NewLeadModal';
import { CheckCircle2, Zap } from 'lucide-react';

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
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerLeadRecord | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await leadsService.getCustomers(filters);
      setCustomers(data);
      const allStats = await leadsService.getStats();
      setStats(allStats);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const handleSimulateIngest = async () => {
    setIsSimulating(true);
    try {
      const randomNames = [
        { first: 'SARAH', last: 'JENNINGS', phone: '+61412890334', vehicle: '2026 XPeng G6 Long Range SUV', price: 68900 },
        { first: 'LIAM', last: 'O\'CONNOR', phone: '+61423456789', vehicle: '2026 XPeng X9 Standard Range', price: 97930 },
      ];
      const selected = randomNames[Math.floor(Math.random() * randomNames.length)];

      const created = await leadsService.createCustomer({
        firstName: selected.first,
        lastName: selected.last,
        mobilePhone: selected.phone,
        dealerName: 'Xpeng Dandenong',
        lead: {
          id: `lead-${Date.now()}`,
          leadIdShort: Math.random().toString(36).substring(2, 8),
          leadCreatedDate: new Date().toISOString(),
          leadSource: 'carsales',
          stage: 'New',
          item: {
            itemDescription: selected.vehicle,
            price: selected.price,
            color: 'Stellar Purple',
            stockNumber: `P${Math.floor(100000 + Math.random() * 899999)}`,
            odometer: 0,
          },
          conversations: [
            {
              conversationId: `conv-${Date.now()}`,
              messageType: 'Message',
              newMessageCounter: 1,
            },
          ],
          allocatedPersonFullName: 'Devs',
        },
      });

      showToast(
        `⚡ Ingested lead from carsales: ${created.firstName} ${created.lastName} (${created.lead.item?.itemDescription})`
      );
      await loadData();
    } finally {
      setIsSimulating(false);
    }
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
        onSimulateIngest={handleSimulateIngest}
        isSimulating={isSimulating}
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
