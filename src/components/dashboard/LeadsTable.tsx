'use client';

import React from 'react';
import { CustomerLeadRecord } from '@/types/lead';
import { Badge } from '@/components/ui/Badge';
import {
  Car,
  Mail,
  Phone,
  Eye,
  ChevronDown,
  MessageSquare,
  Layers,
  MapPin,
  Calendar,
} from 'lucide-react';

interface LeadsTableProps {
  customers: CustomerLeadRecord[];
  isLoading: boolean;
  onSelectCustomer: (customer: CustomerLeadRecord) => void;
  onUpdateStage: (customerId: string, stage: string) => void;
}

export function LeadsTable({
  customers,
  isLoading,
  onSelectCustomer,
  onUpdateStage,
}: LeadsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="inline-block w-7 h-7 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-500">Loading dealership leads...</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
          <Car className="w-6 h-6 text-slate-700" />
        </div>
        <h4 className="text-base font-semibold text-slate-900">No leads match filters</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No customer records match your current criteria. Try resetting search or simulate a new ingestion.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Customer & Contact</th>
              <th className="py-3 px-4">Vehicle Enquired</th>
              <th className="py-3 px-4">Source & Dealership</th>
              <th className="py-3 px-4">Activity & Rep</th>
              <th className="py-3 px-4">Pipeline Stage</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {customers.map((c) => {
              const lead = c.lead;
              const customerName = `${c.firstName} ${c.lastName || ''}`.trim();
              const phone = c.mobilePhone || c.homePhone;
              const hasMultiLeads = (c.leadCount && c.leadCount > 1) || (c.otherLeads && c.otherLeads.length > 0);
              const conversations = lead.conversations || [];
              const totalMessages = conversations.reduce(
                (sum, conv) => sum + (conv.newMessageCounter || 0),
                0
              );

              return (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectCustomer(c)}
                >
                  {/* Customer Contact */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                        <span>{customerName}</span>
                        {c.customerType && (
                          <span className="text-[10px] font-normal text-slate-400">
                            ({c.customerType})
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                        {c.email ? (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[170px]">
                              {c.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No Email</span>
                        )}
                        {phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{phone}</span>
                          </div>
                        )}
                        {(c.postcode || c.stateShortName) && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>
                              {c.postcode} {c.stateShortName || c.stateLongName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Vehicle of Interest */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1 max-w-[280px]">
                      <div className="flex items-start gap-1.5 font-medium text-slate-900 text-xs sm:text-sm">
                        <Car className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {lead.item?.itemDescription || 'Vehicle Enquiry'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {lead.item?.price ? (
                          <span className="text-emerald-700 font-bold">
                            ${lead.item.price.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Price on enquiry</span>
                        )}

                        {lead.item?.stockNumber && (
                          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {lead.item.stockNumber}
                          </span>
                        )}

                        {lead.item?.color && (
                          <span className="text-[11px] text-slate-500">
                            {lead.item.color}
                          </span>
                        )}
                      </div>

                      {hasMultiLeads && (
                        <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          <Layers className="w-3 h-3" />
                          <span>{c.leadCount} Vehicle Enquiries</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Source & Dealership */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="source">
                          {lead.leadSource || 'carsales'}
                        </Badge>
                        <span className="text-[10px] font-mono text-slate-400">
                          #{lead.leadIdShort}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        {c.dealerName}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          {new Date(lead.leadCreatedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Activity & Rep */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-700">
                        Rep: <span className="font-semibold text-slate-900">{lead.allocatedPersonFullName || 'Devs'}</span>
                      </div>
                      {totalMessages > 0 && (
                        <div className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          <MessageSquare className="w-3 h-3 text-slate-500" />
                          <span>{totalMessages} Unread Message{totalMessages > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {lead.tags && lead.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {lead.tags.slice(0, 2).map((t) => (
                            <span
                              key={t.label}
                              className="text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200"
                            >
                              {t.friendlyLabel || t.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Pipeline Stage Dropdown */}
                  <td
                    className="py-3.5 px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative inline-block">
                      <select
                        value={lead.stage || 'New'}
                        onChange={(e) => onUpdateStage(c.id, e.target.value)}
                        className="appearance-none bg-white border border-slate-300 hover:border-slate-400 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer shadow-2xs"
                      >
                        <option value="New">● New</option>
                        <option value="Contacted">● Contacted</option>
                        <option value="Test Drive">● Test Drive</option>
                        <option value="In Progress">● In Progress</option>
                        <option value="Won">● Won (Deal Closed)</option>
                        <option value="Lost">● Lost</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onSelectCustomer(c)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="View full lead record"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
