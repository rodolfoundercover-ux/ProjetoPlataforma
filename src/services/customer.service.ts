import { createClient } from '@supabase/supabase-js';

export interface Customer {
  id: string;
  agency_id: string;
  auth_user_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  document: string;
  birth_date: string;
  status: string;
}

export interface Passenger {
  id: string;
  agency_id: string;
  owner_customer_id?: string;
  linked_auth_user_id?: string;
  full_name: string;
  document: string;
  birth_date: string;
  phone?: string;
  status: string;
}

export class CustomerService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- Agency Customers (Buyers) ---

  async createCustomer(data: Omit<Customer, 'id' | 'status'>) {
    const { data: customer, error } = await this.supabase
      .from('agency_customers')
      .insert({ ...data, status: 'ACTIVE' })
      .select()
      .single();

    if (error) throw error;
    return customer;
  }

  async getCustomerById(agencyId: string, customerId: string) {
    const { data, error } = await this.supabase
      .from('agency_customers')
      .select('*')
      .eq('agency_id', agencyId)
      .eq('id', customerId)
      .single();

    if (error) throw error;
    return data;
  }

  async listCustomers(agencyId: string) {
    const { data, error } = await this.supabase
      .from('agency_customers')
      .select('*')
      .eq('agency_id', agencyId)
      .eq('status', 'ACTIVE')
      .order('full_name');

    if (error) throw error;
    return data;
  }

  async updateCustomer(customerId: string, updates: Partial<Customer>) {
    const { data, error } = await this.supabase
      .from('agency_customers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', customerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // --- Agency Passengers (Travelers) ---

  async createPassenger(data: Omit<Passenger, 'id' | 'status'>) {
    const { data: passenger, error } = await this.supabase
      .from('agency_passengers')
      .insert({ ...data, status: 'ACTIVE' })
      .select()
      .single();

    if (error) throw error;
    return passenger;
  }

  async getPassengerById(agencyId: string, passengerId: string) {
    const { data, error } = await this.supabase
      .from('agency_passengers')
      .select('*')
      .eq('agency_id', agencyId)
      .eq('id', passengerId)
      .single();

    if (error) throw error;
    return data;
  }

  async listPassengersByCustomer(agencyId: string, customerId: string) {
    const { data, error } = await this.supabase
      .from('agency_passengers')
      .select('*')
      .eq('agency_id', agencyId)
      .eq('owner_customer_id', customerId);

    if (error) throw error;
    return data;
  }

  async updatePassenger(passengerId: string, updates: Partial<Passenger>) {
    const { data, error } = await this.supabase
      .from('agency_passengers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', passengerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
