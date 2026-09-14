"use server";

import { CustomerService } from "@/services/customer.service";
import { revalidatePath } from "next/cache";

const customerService = new CustomerService();

// Mock function to simulate getting agency ID from session
async function getAgencyId(): Promise<string> {
  return "agency_123"; // In production, this comes from auth.getUser()
}

export async function createCustomerAction(formData: FormData) {
  const agencyId = await getAgencyId();
  
  const data = {
    agency_id: agencyId,
    full_name: formData.get("full_name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    document: formData.get("document") as string,
    birth_date: formData.get("birth_date") as string,
  };

  try {
    await customerService.createCustomer(data);
    revalidatePath("/technical/customers");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function listCustomersAction() {
  const agencyId = await getAgencyId();
  try {
    return await customerService.listCustomers(agencyId);
  } catch (e: any) {
    throw new Error(e.message);
  }
}
