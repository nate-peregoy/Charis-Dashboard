/**
 * Type definitions for Charis Foundation Dashboard
 */

// Grant Types
export type GrantStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed';
export type ProgramCategory = 'ministry_leadership' | 'faith_and_work' | 'strategic_grants';

export interface Grant {
  id?: string;
  organizationName: string;
  programCategory: ProgramCategory;
  amountRequested: number;
  amountApproved?: number;
  status: GrantStatus;
  applicationDate: string;
  description: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewDate?: string;
  partnerId?: string; // Link to Partners table
}

// Partner Types
export type PartnerStatus = 'active' | 'inactive' | 'pending' | 'alumni';

export interface Partner {
  id?: string;
  organizationName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status: PartnerStatus;
  totalFundingReceived: number;
  activeGrants: number;
  partnershipStartDate: string;
  description?: string;
  notes?: string;
}

// Meeting Types
export type MeetingStatus = 'scheduled' | 'completed' | 'cancelled';
export type MeetingType = 'board' | 'committee' | 'special' | 'annual';

export interface Meeting {
  id?: string;
  title: string;
  meetingType: MeetingType;
  meetingDate: string;
  startTime: string;
  endTime?: string;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  status: MeetingStatus;
  agenda?: string;
  minutes?: string;
  materialsUrl?: string[];
  attendees?: string[]; // Array of board member IDs
  createdBy?: string;
  notes?: string;
}

// Document Types
export type DocumentCategory = 
  | 'governance' 
  | 'financial' 
  | 'strategic_plan' 
  | 'minutes' 
  | 'policy' 
  | 'report'
  | 'other';

export interface Document {
  id?: string;
  title: string;
  category: DocumentCategory;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  uploadDate: string;
  uploadedBy?: string;
  lastModified?: string;
  tags?: string[];
  accessLevel?: 'public' | 'board' | 'committee' | 'restricted';
  relatedMeetingId?: string;
}

// Board Member Types
export type BoardMemberRole = 'chair' | 'vice_chair' | 'treasurer' | 'secretary' | 'member';

export interface BoardMember {
  id?: string;
  clerkUserId: string; // Link to Clerk authentication
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: BoardMemberRole;
  joinDate: string;
  termEndDate?: string;
  isActive: boolean;
  bio?: string;
  photoUrl?: string;
  committeeAssignments?: string[];
}

// Dashboard Stats Types
export interface DashboardStats {
  totalGrants: number;
  pendingGrants: number;
  approvedGrants: number;
  totalFundingApproved: number;
  activePartners: number;
  upcomingMeetings: number;
  recentDocuments: number;
  grantsByProgram: {
    ministry_leadership: number;
    faith_and_work: number;
    strategic_grants: number;
  };
  recentActivity: Array<{
    type: 'grant' | 'meeting' | 'document' | 'partner';
    title: string;
    date: string;
    description: string;
  }>;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

// Request Body Types
export interface CreateGrantRequest {
  grant: Omit<Grant, 'id'>;
}

export interface UpdateGrantRequest {
  grant: Partial<Grant>;
}

export interface CreatePartnerRequest {
  partner: Omit<Partner, 'id'>;
}

export interface UpdatePartnerRequest {
  partner: Partial<Partner>;
}

export interface CreateMeetingRequest {
  meeting: Omit<Meeting, 'id'>;
}

export interface UpdateMeetingRequest {
  meeting: Partial<Meeting>;
}

export interface CreateDocumentRequest {
  document: Omit<Document, 'id'>;
}

export interface UpdateDocumentRequest {
  document: Partial<Document>;
}
