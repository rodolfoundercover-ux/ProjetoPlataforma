import { listReservationsAction } from "./actions";
import React from "react";
import Link from "next/link";

export default async function ReservationsPage() {
  const reservations = await listReservationsAction();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Reservas</h1>
          <p className="text-muted-foreground">Acompanhe e gerencie as vendas das suas viagens.</p>
        </div>
        <Link 
          href="/technical/reservations/new" 
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          + Nova Reserva
        </Link>
      </div>

      <div className="p-4 border rounded-lg bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b">
            <tr>
              <th className="pb-2 font-medium">Código</th>
              <th className="pb-2 font-medium">Viagem</th>
              <th className="pb-2 font-medium">Valor Total</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Financeiro</th>
              <th className="pb-2 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {reservations && reservations.length > 0 ? (
              reservations.map((res: any) => (
                <tr key={res.id} className="border-b last:border-none hover:bg-muted/50">
                  <td className="py-3 font-mono font-bold">{res.code}</td>
                  <td className="py-3">{res.trip?.title} ({res.trip?.code})</td>
                  <td className="py-3">R$ {res.total_amount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      res.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                      res.status === 'WAITING_ENTRY' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="py-3">{res.financial_status}</td>
                  <td className="py-3">{new Date(res.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  Nenhuma reserva encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
