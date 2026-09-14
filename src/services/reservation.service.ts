import { createClient } from '@supabase/supabase-js';
import { CapacityService } from './capacity.service';

export class ReservationService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  private capacityService = new CapacityService();

  /**
   * Cria uma reserva inicial no estado DRAFT.
   */
  async createReservation(data: {
    agency_id: string;
    trip_id: string;
    buyer_customer_id: string;
    commercial_source: string;
    sales_channel: string;
    entry_amount: number;
    created_by: string;
  }) {
    // Gerar código da reserva (ex: RES-2026-XXXX)
    const code = `RES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: reservation, error } = await this.supabase
      .from('reservations')
      .insert({
        ...data,
        code,
        status: 'DRAFT',
        financial_status: 'PENDING',
      })
      .select()
      .single();

    if (error) throw error;
    return reservation;
  }

  /**
   * Adiciona um passageiro à reserva e solicita hold de vaga/assento.
   * Implementa P04-01 e P04-03.
   */
  async addPassengerToReservation(data: {
    reservation_id: string;
    agency_id: string;
    trip_id: string;
    passenger_id: string | null;
    passenger_name: string;
    document: string;
    birth_date: string;
    category_id: string;
    category_name: string;
    boarding_point_id: string;
    boarding_point_name: string;
    list_price: number;
    sale_price: number;
    discount_amount: number;
    seat_id: string | null;
    userId: string;
  }) {
    // 1. Tentar criar o hold de assento/vaga primeiro (estratégia pessimista)
    const hold = await this.capacityService.createHold(
      data.trip_id, 
      data.seat_id, 
      data.reservation_id, 
      data.userId
    );

    try {
      // 2. Criar o registro do passageiro na reserva com SNAPSHOTS (G.1)
      const { data: resPassenger, error } = await this.supabase
        .from('reservation_passengers')
        .insert({
          agency_id: data.agency_id,
          reservation_id: data.reservation_id,
          trip_id: data.trip_id,
          passenger_id: data.passenger_id,
          passenger_name_snapshot: data.passenger_name,
          document_snapshot: data.document,
          birth_date_snapshot: data.birth_date,
          category_id: data.category_id,
          category_name_snapshot: data.category_name,
          boarding_point_id: data.boarding_point_id,
          boarding_snapshot: data.boarding_point_name,
          list_price: data.list_price,
          sale_price: data.sale_price,
          discount_amount: data.discount_amount,
        })
        .select()
        .single();

      if (error) throw error;

      // 3. Vincular o hold ao passageiro da reserva
      await this.supabase
        .from('seat_holds')
        .update({ reservation_id: data.reservation_id })
        .eq('id', hold.id);

      return { resPassenger, hold };
    } catch (e) {
      // Se falhar a criação do passageiro, liberamos o hold imediatamente
      await this.capacityService.releaseHold(hold.id);
      throw e;
    }
  }

  /**
   * Move a reserva de DRAFT para WAITING_ENTRY.
   */
  async transitionToWaitingEntry(reservationId: string) {
    const { data, error } = await this.supabase
      .from('reservations')
      .update({ status: 'WAITING_ENTRY' })
      .eq('id', reservationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Calcula totais da reserva baseado nos passageiros.
   */
  async updateReservationTotals(reservationId: string) {
    const { data: passengers, error } = await this.supabase
      .from('reservation_passengers')
      .select('sale_price, discount_amount')
      .eq('reservation_id', reservationId);

    if (error) throw error;

    const subtotal = passengers.reduce((acc, p) => acc + Number(p.sale_price), 0);
    const discount_total = passengers.reduce((acc, p) => acc + Number(p.discount_amount), 0);
    const total_amount = subtotal - discount_total;

    const { data, error: updateError } = await this.supabase
      .from('reservations')
      .update({
        subtotal,
        discount_total,
        total_amount
      })
      .eq('id', reservationId)
      .select()
      .single();

    if (updateError) throw updateError;
    return data;
  }
}
