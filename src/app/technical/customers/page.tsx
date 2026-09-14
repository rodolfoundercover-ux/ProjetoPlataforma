export const dynamic = 'force-dynamic';
import { listCustomersAction, createCustomerAction } from './actions';
import React from 'react';

export default async function CustomersPage() {
  const customers = await listCustomersAction();
  return (
    <div className='p-6 space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Gestão de Clientes</h1>
        <p className='text-muted-foreground'>Cadastre e gerencie os compradores de suas viagens.</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='p-4 border rounded-lg bg-card shadow-sm'>
          <h2 className='text-lg font-semibold mb-4'>Novo Cliente</h2>
          <form action={createCustomerAction} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Nome Completo</label>
              <input name='full_name' required className='w-full p-2 border rounded bg-background' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>E-mail</label>
              <input name='email' type='email' required className='w-full p-2 border rounded bg-background' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Telefone</label>
              <input name='phone' className='w-full p-2 border rounded bg-background' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>CPF/Documento</label>
              <input name='document' required className='w-full p-2 border rounded bg-background' />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Data de Nascimento</label>
              <input name='birth_date' type='date' required className='w-full p-2 border rounded bg-background' />
            </div>
            <button type='submit' className='w-full bg-primary text-white p-2 rounded hover:bg-primary/90 transition-colors'>
              Cadastrar Cliente
            </button>
          </form>
        </div>
        <div className='md:col-span-2 p-4 border rounded-lg bg-card shadow-sm'>
          <h2 className='text-lg font-semibold mb-4'>Clientes Cadastrados</h2>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='border-b'>
                <tr>
                  <th className='pb-2 font-medium'>Nome</th>
                  <th className='pb-2 font-medium'>E-mail</th>
                  <th className='pb-2 font-medium'>Documento</th>
                  <th className='pb-2 font-medium'>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers && customers.length > 0 ? (
                  customers.map((customer: any) => (
                    <tr key={customer.id} className='border-b last:border-none hover:bg-muted/50'>
                      <td className='py-2'>{customer.full_name}</td>
                      <td className='py-2'>{customer.email}</td>
                      <td className='py-2'>{customer.document}</td>
                      <td className='py-2'>
                        <span className='px-2 py-1 rounded-full text-xs bg-green-100 text-green-800'>
                          {customer.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className='py-4 text-center text-muted-foreground'>
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
