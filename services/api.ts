// services/api.ts
const API_BASE_URL = 'http://localhost:5000/api';

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  birth_date: string;
  gender: string;
  baptism_date: string;
  confirmation_date: string;
  status: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  max_capacity: number;
  rsvp_count: number;
}

export interface DashboardStats {
  totalMembers: number;
  upcomingEvents: number;
  recentAttendance: number;
  totalDonations: number;
}

export interface Donation {
  id: string;
  member_id: string;
  amount: number;
  type: string;
  date: string;
  description: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface FinanceStats {
  monthlyTotal: number;
  yearlyTotal: number;
  typeBreakdown: Array<{
    type: string;
    count: number;
    total: number;
  }>;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Dashboard API
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request('/dashboard/stats');
  }

  // Members API
  async getMembers(): Promise<Member[]> {
    return this.request('/members');
  }

  async createMember(memberData: Partial<Member>): Promise<Member> {
    return this.request('/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  // Events API
  async getEvents(): Promise<Event[]> {
    return this.request('/events');
  }

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }
  // Finance API
  async getDonations(): Promise<Donation[]> {
    return this.request('/finance/donations');
  }

  async recordDonation(donationData: Partial<Donation>): Promise<Donation> {
    return this.request('/finance/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  }

  async getFinanceStats(): Promise<FinanceStats> {
    return this.request('/finance/stats');
  }
  async rsvpToEvent(eventId: string, userId: string): Promise<any> {
    return this.request('/events/rsvp', {
      method: 'POST',
      body: JSON.stringify({ eventId, userId }),
    });
 

}
}

export const apiService = new ApiService();