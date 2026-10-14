'use client';

import React, { useState } from 'react';
import { CustomerLeadRecord } from '@/types/lead';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCustomer: (
    customer: Partial<CustomerLeadRecord>
  ) => Promise<void>;
}

export function NewLeadModal({
  isOpen,
  onClose,
  onCreateCustomer,
}: NewLeadModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dealerName, setDealerName] = useState('Xpeng Dandenong');
  const [source, setSource] = useState('carsales');
  const [vehicleDescription, setVehicleDescription] = useState('2026 XPeng G6 Performance SUV Automatic');
  const [price, setPrice] = useState('71708');
  const [color, setColor] = useState('Midnight Black');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName || !phone) {
      setError('Please provide at least a customer first name and phone number.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateCustomer({
        firstName,
        lastName: lastName || null,
        email: email || null,
        mobilePhone: phone,
        dealerName,
        lead: {
          id: `lead-${Date.now()}`,
          leadIdShort: Math.random().toString(36).substring(2, 8),
          leadCreatedDate: new Date().toISOString(),
          leadSource: source,
          stage: 'New',
          item: {
            itemDescription: vehicleDescription,
            price: parseInt(price) || undefined,
            color,
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
      onClose();
      // Reset
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Inbound Showroom Lead"
      description="Inject enquiry into Dealer Socket Automation pipeline"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Customer Information */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Customer Contact Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="e.g. Kushkumar"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              placeholder="e.g. Patel"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              label="Contact Phone"
              placeholder="+61 450 664 252"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Vehicle Specification
          </h4>
          <div className="space-y-3">
            <Input
              label="Vehicle Description"
              placeholder="e.g. 2026 XPeng X9 Standard Range"
              value={vehicleDescription}
              onChange={(e) => setVehicleDescription(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Price ($ AUD)"
                type="number"
                placeholder="97930"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <Input
                label="Color"
                placeholder="e.g. Stellar Purple"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Source & Dealer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Lead Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-lg bg-white text-slate-900 border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-900 cursor-pointer"
            >
              <option value="carsales">carsales</option>
              <option value="SMS connect">SMS connect</option>
              <option value="Email">Email</option>
              <option value="Walk-In">Walk-In</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Dealership
            </label>
            <Input
              value={dealerName}
              onChange={(e) => setDealerName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Plus className="w-4 h-4 text-white" />}
          >
            Create Showroom Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
}
