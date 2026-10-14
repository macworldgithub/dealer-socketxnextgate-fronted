import { CustomerLeadRecord, LeadFilterOptions, LeadStats } from '@/types/lead';
import { apiRequest, IS_MOCK_MODE } from './client';
import { calculateLeadStats, INITIAL_MOCK_CUSTOMERS } from '../mock/mockData';

const CUSTOMERS_STORAGE_KEY = 'dealersocket_customers_cache_v2';

function getStoredCustomers(): CustomerLeadRecord[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_CUSTOMERS;
  const stored = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_CUSTOMERS));
    return INITIAL_MOCK_CUSTOMERS;
  }
  try {
    return JSON.parse(stored) as CustomerLeadRecord[];
  } catch {
    return INITIAL_MOCK_CUSTOMERS;
  }
}

function saveStoredCustomers(customers: CustomerLeadRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
}

export const leadsService = {
  /**
   * Fetch customer leads list with optional filtering
   * Maps to: GET /leads or GET /customers
   */
  async getCustomers(filters?: LeadFilterOptions): Promise<CustomerLeadRecord[]> {
    if (IS_MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      let customers = getStoredCustomers();

      if (filters?.search) {
        const query = filters.search.toLowerCase();
        customers = customers.filter((c) => {
          const fullName = `${c.firstName} ${c.lastName || ''}`.toLowerCase();
          const email = (c.email || '').toLowerCase();
          const phone = `${c.mobilePhone || ''} ${c.homePhone || ''}`.toLowerCase();
          const vehicle = (c.lead.item?.itemDescription || '').toLowerCase();
          const stock = (c.lead.item?.stockNumber || '').toLowerCase();
          const dealer = (c.dealerName || '').toLowerCase();
          const id = (c.lead.leadIdShort || c.id || '').toLowerCase();

          return (
            fullName.includes(query) ||
            email.includes(query) ||
            phone.includes(query) ||
            vehicle.includes(query) ||
            stock.includes(query) ||
            dealer.includes(query) ||
            id.includes(query)
          );
        });
      }

      if (filters?.stage && filters.stage !== 'all') {
        customers = customers.filter(
          (c) => c.lead.stage?.toLowerCase() === filters.stage?.toLowerCase()
        );
      }

      if (filters?.source && filters.source !== 'all') {
        customers = customers.filter(
          (c) => c.lead.leadSource?.toLowerCase() === filters.source?.toLowerCase()
        );
      }

      return customers;
    }

    // Live Backend Call
    return apiRequest<CustomerLeadRecord[]>('/customers', {
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Get single customer by ID
   */
  async getCustomerById(id: string): Promise<CustomerLeadRecord | null> {
    if (IS_MOCK_MODE) {
      const customers = getStoredCustomers();
      return customers.find((c) => c.id === id || c.lead.id === id) || null;
    }
    return apiRequest<CustomerLeadRecord>(`/customers/${id}`);
  },

  /**
   * Update lead stage (New, Contacted, Test Drive, Won, Lost)
   */
  async updateLeadStage(
    customerId: string,
    newStage: string
  ): Promise<CustomerLeadRecord> {
    if (IS_MOCK_MODE) {
      const customers = getStoredCustomers();
      const index = customers.findIndex(
        (c) => c.id === customerId || c.lead.id === customerId
      );
      if (index === -1) {
        throw new Error(`Customer lead ${customerId} not found`);
      }
      const updated: CustomerLeadRecord = {
        ...customers[index],
        lead: {
          ...customers[index].lead,
          stage: newStage,
          lastActionedTime: new Date().toISOString(),
        },
      };
      customers[index] = updated;
      saveStoredCustomers(customers);
      return updated;
    }

    return apiRequest<CustomerLeadRecord>(`/leads/${customerId}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage: newStage }),
    });
  },

  /**
   * Create a new incoming customer lead
   */
  async createCustomer(
    customerData: Partial<CustomerLeadRecord>
  ): Promise<CustomerLeadRecord> {
    if (IS_MOCK_MODE) {
      const customers = getStoredCustomers();
      const randomId = Math.random().toString(36).substring(2, 10);
      const newCustomer: CustomerLeadRecord = {
        id: `cust-${Date.now()}`,
        sellerIdentifier: '84e45bb0-7624-496f-79f4-34e03772e3ce',
        dealerName: customerData.dealerName || 'Xpeng Dandenong',
        firstName: customerData.firstName || 'New',
        lastName: customerData.lastName || 'Enquiry',
        email: customerData.email || null,
        mobilePhone: customerData.mobilePhone || null,
        homePhone: customerData.homePhone || null,
        priority: 'Not Set',
        customerType: 'Individual',
        leadCount: 1,
        lead: {
          id: `lead-${Date.now()}`,
          leadIdShort: randomId,
          leadCreatedDate: new Date().toISOString(),
          leadSource: customerData.lead?.leadSource || 'carsales',
          stage: 'New',
          item: {
            itemDescription:
              customerData.lead?.item?.itemDescription || '2026 XPeng G6 SUV',
            price: customerData.lead?.item?.price || 64900,
            color: customerData.lead?.item?.color || 'White',
            stockNumber: `P${Math.floor(100000 + Math.random() * 899999)}`,
            odometer: 0,
          },
          tags: [{ label: 'Automated', friendlyLabel: 'Automated' }],
          conversations: [
            {
              conversationId: `conv-${Date.now()}`,
              messageType: 'Message',
              newMessageCounter: 1,
            },
          ],
          allocatedPersonFullName: 'Devs',
        },
        otherLeads: [],
        allocatedPerson: {
          fullName: 'Devs',
          firstName: 'Devs',
        },
      };
      const updated = [newCustomer, ...customers];
      saveStoredCustomers(updated);
      return newCustomer;
    }

    return apiRequest<CustomerLeadRecord>('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  /**
   * Pipeline stats
   */
  async getStats(): Promise<LeadStats> {
    if (IS_MOCK_MODE) {
      const customers = getStoredCustomers();
      return calculateLeadStats(customers);
    }
    return apiRequest<LeadStats>('/leads/stats');
  },
};
