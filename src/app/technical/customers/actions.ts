"use server";

import { revalidatePath } from 'next/cache';
import { CustomerService } from '@/services/customer.service';
import { serverSupabase } from '@/lib/supabase/server';

const customerService = new CustomerService();

async function getAgencyId() {
  const supabase = await serverSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');

  const { data: member, error: memberError } = await supabase
    .from('agency_members')
    .select('agency_id')
    .eq('user_id', user.id)
    .single();

  if (memberError || !member) throw new Error('User not associated with any agency');
  return member.agency_id;
}

export async function createCustomerAction(formData: FormData) {
  try {
    const agencyId = await getAgencyId();
    const rawFormData = Object.fromEntries(formData.entries());
    
    await customerService.createCustomer({
      agency_id: agencyId,
      full_name: rawFormData.full_name as string,
      email: rawFormData.email as string,
      phone: rawFormData.phone as string,
      document: rawFormData.document as string,
      birth_date: rawFormData.birth_date as string,
    });

    revalidatePath('/technical/customers');
  } catch (error: any) {
    console.error('Error creating customer:', error);
    throw new Error(error.message || 'Failed to create customer');
  }
}

export async function listCustomersAction() {
  try {
    const agencyId = await getAgencyId();
    return await customerService.listCustomers(agencyId);
  } catch (error: any) {
    console.error('Error listing customers:', error);
    return [];
  }
}
