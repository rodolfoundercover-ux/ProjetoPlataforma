import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CapacityService } from '@/services/capacity.service';
import { ReservationService } from '@/services/reservation.service';

// Mock Supabase Client
const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  gt: vi.fn().mockReturnThis(),
  lt: vi.fn().mockReturnThis(),
  is: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn(),
  single: vi.fn(),
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase,
}));

describe('PHASE_04 - CapacityService', () => {
  let service: CapacityService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new CapacityService();
  });

  it('should create a hold when seat is available', async () => {
    mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null }); // No existing hold
    mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null }); // No assignment
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'hold-123' }, error: null });

    const result = await service.createHold('trip-1', 'seat-A1', null, 'user-1');
    expect(result.id).toBe('hold-123');
  });

  it('should throw error when seat is already held', async () => {
    mockSupabase.maybeSingle.mockResolvedValueOnce({ data: { id: 'hold-existing' }, error: null });

    await expect(service.createHold('trip-1', 'seat-A1', null, 'user-1'))
      .rejects.toThrow('Este assento já está reservado temporariamente.');
  });

  it('should throw error when seat is already assigned', async () => {
    mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null }); // No hold
    mockSupabase.maybeSingle.mockResolvedValueOnce({ data: { id: 'assign-123' }, error: null }); // assigned

    await expect(service.createHold('trip-1', 'seat-A1', null, 'user-1'))
      .rejects.toThrow('Este assento já está ocupado definitivamente.');
  });
});

describe('PHASE_04 - ReservationService', () => {
  let service: ReservationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ReservationService();
  });

  it('should calculate totals correctly', async () => {
    mockSupabase.select.mockResolvedValueOnce({
      data: [
        { sale_price: 100, discount_amount: 10 },
        { sale_price: 100, discount_amount: 20 },
      ],
      error: null,
    });
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'res-1' }, error: null });

    const result = await service.updateReservationTotals('res-1');
    
    expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
      subtotal: 200,
      discount_total: 30,
      total_amount: 170
    }));
  });

  it('should create reservation in DRAFT state', async () => {
    mockSupabase.single.mockResolvedValueOnce({ 
      data: { id: 'res-1', status: 'DRAFT' }, 
      error: null 
    });

    const res = await service.createReservation({
      agency_id: 'ag-1',
      trip_id: 'tr-1',
      buyer_customer_id: 'cu-1',
      commercial_source: 'DIRECT',
      sales_channel: 'OFFLINE',
      entry_amount: 0,
      created_by: 'user-1'
    });

    expect(res.status).toBe('DRAFT');
  });
});
