'use client';

import React from 'react';
import { CustomerLeadRecord } from '@/types/lead';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Car,
  User,
  Mail,
  Phone,
  Layers,
  MessageSquare,
  Tag,
} from 'lucide-react';

interface LeadDetailModalProps {
  customer: CustomerLeadRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (customerId: string, stage: string) => void;
}

export function LeadDetailModal({
  customer,
  isOpen,
  onClose,
  onUpdateStage,
}: LeadDetailModalProps) {
  if (!customer) return null;

  const lead = customer.lead;
  const fullName = `${customer.firstName} ${customer.lastName || ''}`.trim();
  const phone = customer.mobilePhone || customer.homePhone;
  const otherLeads = customer.otherLeads || [];
  const conversations = lead.conversations || [];

  const handleStageClick = (stage: string) => {
    onUpdateStage(customer.id, stage);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${fullName} — #${lead.leadIdShort}`}
      description={`${customer.dealerName} • Source: ${lead.leadSource || 'carsales'}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Stage & Header Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Stage:</span>
            <Badge variant="status" status={lead.stage} dot>
              {lead.stage}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Lead Type:</span>
            <span className="text-xs font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              {lead.leadType || 'SHOWROOM'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Assigned Rep:</span>
            <span className="text-xs font-semibold text-slate-900">
              {lead.allocatedPersonFullName || 'Devs'}
            </span>
          </div>
        </div>

        {/* Customer Profile */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-700" />
            Customer Contact Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-200 text-xs">
            <div>
              <p className="text-slate-400">Full Name</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">
                {fullName}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Customer Type</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">
                {customer.customerType || 'Individual'}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Email Address</p>
              {customer.email ? (
                <a
                  href={`mailto:${customer.email}`}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1.5 mt-0.5 font-medium"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {customer.email}
                </a>
              ) : (
                <p className="text-slate-400 italic mt-0.5">Not provided</p>
              )}
            </div>
            <div>
              <p className="text-slate-400">Contact Phone</p>
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="text-sm text-emerald-700 hover:underline flex items-center gap-1.5 mt-0.5 font-medium"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {phone}
                </a>
              ) : (
                <p className="text-slate-400 italic mt-0.5">Not provided</p>
              )}
            </div>
            {(customer.postcode || customer.stateShortName || customer.stateLongName) && (
              <div className="sm:col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-slate-600">
                <span>Location</span>
                <span className="font-semibold text-slate-900">
                  {customer.postcode} {customer.stateShortName || customer.stateLongName}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Primary Vehicle Enquired */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-slate-700" />
            Primary Vehicle Enquiry
          </h4>
          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-base font-bold text-slate-900">
                {lead.item?.itemDescription || 'Vehicle Enquiry'}
              </span>
              {lead.item?.price ? (
                <span className="text-base font-bold text-emerald-700">
                  ${lead.item.price.toLocaleString()}
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-500">
                  Price on enquiry
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              {lead.item?.stockNumber && (
                <div>
                  <span className="text-slate-400 block">Stock Number</span>
                  <span className="text-slate-900 font-mono font-medium">
                    {lead.item.stockNumber}
                  </span>
                </div>
              )}
              {lead.item?.color && (
                <div>
                  <span className="text-slate-400 block">Color</span>
                  <span className="text-slate-900 font-medium">
                    {lead.item.color}
                  </span>
                </div>
              )}
              {lead.opportunity && (
                <div>
                  <span className="text-slate-400 block">Opportunity</span>
                  <span className="text-slate-900 font-medium">
                    {lead.opportunity}
                  </span>
                </div>
              )}
              {lead.item?.specificationId && (
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-slate-400 block">Specification ID</span>
                  <span className="text-slate-600 font-mono text-[11px] truncate block">
                    {lead.item.specificationId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Multi-Vehicle Enquiries (Other Leads) */}
        {otherLeads.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Additional Vehicles Inquired by Customer ({otherLeads.length})
            </h4>
            <div className="space-y-2">
              {otherLeads.map((ol) => (
                <div
                  key={ol.id}
                  className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900 block">
                      {ol.item?.itemDescription}
                    </span>
                    <span className="text-slate-500 text-[11px] block">
                      Ref #{ol.leadIdShort} • Source: {ol.leadSource}
                    </span>
                  </div>
                  {ol.item?.price && (
                    <span className="font-bold text-emerald-700 text-sm">
                      ${ol.item.price.toLocaleString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversations & Messages */}
        {conversations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-700" />
              Communication Streams
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {conversations.map((conv) => (
                <div
                  key={conv.conversationId}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-800">
                    Channel: {conv.messageType}
                  </span>
                  {conv.newMessageCounter > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                      {conv.newMessageCounter} Unread
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-700" />
              Lead Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {lead.tags.map((t) => (
                <span
                  key={t.label}
                  className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {t.friendlyLabel || t.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stage Progression */}
        <div className="space-y-2 pt-3 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-700">
            Pipeline Stage Progression:
          </p>
          <div className="flex flex-wrap gap-2">
            {['New', 'Contacted', 'Test Drive', 'In Progress', 'Won', 'Lost'].map(
              (stage) => {
                const isCurrent = lead.stage?.toLowerCase() === stage.toLowerCase();
                return (
                  <Button
                    key={stage}
                    size="sm"
                    variant={isCurrent ? 'primary' : 'outline'}
                    onClick={() => handleStageClick(stage)}
                    className="text-xs font-medium"
                  >
                    {stage}
                  </Button>
                );
              }
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
