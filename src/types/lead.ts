export interface LeadItem {
  id: string;
  leadIdShort: string;
  leadCreatedDate: string;
  messageInfo?: {
    enabled: boolean;
    unreadComments: boolean;
  };
  item: {
    itemDescription: string;
    itemImageUrl?: string | null;
    itemFullImageUrl?: string | null;
    price?: number | null;
    odometer?: number;
    color?: string;
    stockNumber?: string | null;
    specificationId?: string;
    itemId?: string | null;
  };
  leadSource: string;
  multipleVehicleEnquiries?: boolean;
  stats?: {
    emailCount: number;
    smsCount: number;
    phoneCallCount: number;
    appointmentCount: number;
  };
  stage: string; // e.g. "New", "Contacted", "Test Drive", "Won", "Lost"
  lastActionedTime?: string | null;
  pendingResult?: string;
  pendingResultStatus?: string | null;
  finance?: {
    providerName?: string;
    providerType?: string;
    externalStatus?: string;
    internalPackageName?: string;
  };
  isArchived?: boolean;
  leadType?: string;
  inventoryType?: string;
  opportunity?: string;
  sourcing?: string | null;
  appointments?: unknown[];
  priority?: string;
  tags?: Array<{
    label: string;
    friendlyLabel: string;
  }> | null;
  conversations?: Array<{
    conversationId: string;
    messageType: string;
    newMessageCounter: number;
    hasMissedCall?: boolean;
    source?: string | null;
  }>;
  belloAppVoiceCallReady?: string;
  aiRepliedAt?: string | null;
  detailsUrl?: string;
  allocatedPersonId?: string | null;
  allocatedPersonFullName?: string;
  allocatedPersonFirstName?: string | null;
  allocatedPersonLastName?: string | null;
  allocatedPersonImageUrl?: string | null;
}

export interface CustomerLeadRecord {
  id: string;
  customerId?: string | null;
  sellerIdentifier?: string;
  dealerName: string;
  firstName: string;
  lastName?: string | null;
  mobilePhone?: string | null;
  homePhone?: string | null;
  priority: string;
  customerType: string;
  lead: LeadItem;
  otherLeads: LeadItem[];
  leadCount: number;
  matchingCustomerId?: string | null;
  matchingCustomerFields?: unknown | null;
  postcode?: string | null;
  stateLongName?: string;
  stateShortName?: string;
  email?: string | null;
  allocatedPerson?: {
    firstName?: string | null;
    lastName?: string | null;
    fullName?: string | null;
    imageUrl?: string | null;
    id?: string;
  };
  emailVerified?: boolean;
  phoneVerified?: boolean;
  detailsUrl?: string;
}

export interface BackendLeadsResponse {
  customers: CustomerLeadRecord[];
  count: number;
  offset: number;
  scope: string;
}

export interface LeadFilterOptions {
  search?: string;
  stage?: string | 'all';
  source?: string | 'all';
  dealer?: string | 'all';
}

export interface LeadStats {
  total: number;
  newLeads: number;
  contacted: number;
  inProgress: number;
  closedWon: number;
  multiEnquiriesCount: number;
}
