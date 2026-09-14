import { createClient } from '@supabase/supabase-js';

// Tipos básicos para o serviço de capacidade
export interface SeatHold {
  id: string;
  trip_id: string;
  seat_id: string | null;
  reservation_id: string | null;
  expires_at: string;
}

export interface SeatAssignment {
  id: string;
  trip_id: string;
  reservation_passenger_id: string;
  seat_id: string;
}

export class CapacityService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  /**
   * Tenta criar um hold para um assento ou vaga geral.
   * Implementa a regra P04-02: Proteção contra concorrência.
   */
  async createHold(tripId: string, seatId: string | null, reservationId: string | null, userId: string, durationMinutes = 15) {
    // 1. Verificar se existe hold ativo ou atribuição definitiva
    const { data: existing, error: checkError } = await this.supabase
      .from('seat_holds')
      .select('id')
      .eq('trip_id', tripId)
      .eq('seat_id', seatId)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (checkError) throw checkError;
    if (existing) {
      throw new Error('Este assento já está reservado temporariamente.');
    }

    // Verificar se já existe atribuição definitiva
    const { data: assigned, error: assignError } = await this.supabase
      .from('seat_assignments')
      .select('id')
      .eq('trip_id', tripId)
      .eq('seat_id', seatId)
      .is('released_at', null)
      .maybeSingle();

    if (assignError) throw assignError;
    if (assigned) {
      throw new Error('Este assento já está ocupado definitivamente.');
    }

    // 2. Criar o hold
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + durationMinutes);

    const { data, error } = await this.supabase
      .from('seat_holds')
      .insert({
        trip_id: tripId,
        seat_id: seatId,
        reservation_id: reservationId,
        created_by: userId,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Confirma o hold, transformando-o em uma atribuição definitiva.
   * Implementa a transição de hold -> assignment.
   */
  async confirmHold(holdId: string, reservationPassengerId: string) {
    // Em um cenário real, isso deveria ser um RPC no Supabase para ser atômico.
    
    // 1. Buscar dados do hold
    const { data: hold, error: holdError } = await this.supabase
      .from('seat_holds')
      .select('*')
      .eq('id', holdId)
      .single();

    if (holdError || !hold) throw new Error('Hold não encontrado ou inválido.');

    // 2. Criar a atribuição definitiva
    const { data: assignment, error: assignError } = await this.supabase
      .from('seat_assignments')
      .insert({
        trip_id: hold.trip_id,
        reservation_passenger_id: reservationPassengerId,
        seat_id: hold.seat_id!,
      })
      .select()
      .single();

    if (assignError) throw assignError;

    // 3. Remover o hold
    await this.supabase.from('seat_holds').delete().eq('id', holdId);

    return assignment;
  }

  /**
   * Libera um hold manualmente.
   */
  async releaseHold(holdId: string) {
    const { error } = await this.supabase.from('seat_holds').delete().eq('id', holdId);
    if (error) throw error;
    return { success: true };
  }

  /**
   * Limpeza de holds expirados (idealmente rodado via Cron/Edge Function).
   */
  async cleanupExpiredHolds() {
    const { error } = await this.supabase
      .from('seat_holds')
      .delete()
      .lt('expires_at', new Date().toISOString());
    
    if (error) throw error;
    return { success: true };
  }
}
