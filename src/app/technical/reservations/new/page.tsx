"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CapacityService } from "@/services/capacity.service";
import { ReservationService } from "@/services/reservation.service";
import { CustomerService } from "@/services/customer.service";

export default function NewReservationPage() {
  const router = useRouter();
  const capacityService = new CapacityService();
  const reservationService = new ReservationService();
  const customerService = new CustomerService();

  // Estado Global do Fluxo
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Dados da Reserva
  const [reservation, setReservation] = useState<{id: string, trip_id: string, buyer_id: string} | null>(null);
  const [tripId, setTripId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [passengers, setPassengers] = useState<any[]>([]);
  
  // Dados do passageiro atual sendo adicionado
  const [currentPassenger, setCurrentPassenger] = useState({
    passengerId: "",
    categoryId: "",
    boardingPointId: "",
    seatId: "",
  });

  // Listas para SeleÃ§Ã£o
  const [trips, setTrips] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [passengersList, setPassengersList] = useState<any[]>([]);

  useEffect(() => {
    async function loadInitialData() {
      // Aqui buscarÃ­amos de APIs reais. SimulaÃ§Ã£o de carregamento:
      const resTrips = await fetch("/api/technical/trips"); // Exemplo
      // setTrips(await resTrips.json());
      
      // Para fins de demo, usaremos dados simulados se as APIs nÃ£o estiverem prontas
      setTrips([
        { id: "trip-1", title: "Ubatuba 2026", code: "UBT-01" },
        { id: "trip-2", title: "Arraial do Cabo", code: "ARC-05" },
      ]);
      
      setCustomers([
        { id: "cust-1", full_name: "JoÃ£o Silva" },
        { id: "cust-2", full_name: "Maria Oliveira" },
      ]);
    }
    loadInitialData();
  }, []);

  const handleStep1 = async () => {
    if (!tripId || !customerId) return alert("Selecione a viagem e o cliente.");
    setLoading(true);
    try {
      const res = await reservationService.createReservation({
        agency_id: "AGENCY_ID",
        trip_id: tripId,
        buyer_customer_id: customerId,
        commercial_source: "DIRECT",
        sales_channel: "OFFLINE",
        entry_amount: 0,
        created_by: "ADMIN",
      });
      setReservation(res);
      setStep(2);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPassenger = async () => {
    if (!currentPassenger.passengerId || !currentPassenger.seatId) return alert("Preencha todos os dados do passageiro.");
    
    setLoading(true);
    try {
      const resPass = await reservationService.addPassengerToReservation({
        reservation_id: reservation!.id,
        agency_id: "AGENCY_ID",
        trip_id: tripId,
        passenger_id: currentPassenger.passengerId,
        passenger_name: "Passageiro Exemplo", // Buscaria do cadastro
        document: "000.000.000-00",
        birth_date: "1990-01-01",
        category_id: currentPassenger.categoryId,
        category_name: "Adulto",
        boarding_point_id: currentPassenger.boardingPointId,
        boarding_point_name: "RodoviÃ¡ria Centro",
        list_price: 100,
        sale_price: 100,
        discount_amount: 0,
        seat_id: currentPassenger.seatId,
        userId: "ADMIN",
      });
      
      setPassengers([...passengers, resPass.resPassenger]);
      setCurrentPassenger({ passengerId: "", categoryId: "", boardingPointId: "", seatId: "" });
      
      // Atualiza totais da reserva
      await reservationService.updateReservationTotals(reservation!.id);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    setLoading(true);
    try {
      await reservationService.transitionToWaitingEntry(reservation!.id);
      router.push("/technical/reservations");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Nova Reserva</h1>
        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === s ? 'bg-primary text-white' : 'bg-muted'}`}>
              {s}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Passo 1: ConfiguraÃ§Ãµes BÃ¡sicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Viagem</label>
              <select value={tripId} onChange={e => setTripId(e.target.value)} className="w-full p-2 border rounded bg-background">
                <option value="">Selecione a viagem...</option>
                {trips.map(t => <option key={t.id} value={t.id}>{t.title} ({t.code})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cliente Comprador</label>
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="w-full p-2 border rounded bg-background">
                <option value="">Selecione o cliente...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </div>
          </div>
          <button 
            onClick={handleStep1} 
            disabled={loading}
            className="w-full bg-primary text-white p-3 rounded-lg font-bold hover:bg-primary/90"
          >
            {loading ? "Processando..." : "AvanÃ§ar para Passageiros"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">Passo 2: Adicionar Passageiros</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Passageiro</label>
                <select value={currentPassenger.passengerId} onChange={e => setCurrentPassenger({...currentPassenger, passengerId: e.target.value})} className="w-full p-2 border rounded bg-background">
                  <option value="">Selecione o passageiro...</option>
                  <option value="p1">Passageiro 1</option>
                  <option value="p2">Passageiro 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assento/Vaga</label>
                <input 
                  value={currentPassenger.seatId} 
                  onChange={e => setCurrentPassenger({...currentPassenger, seatId: e.target.value})}
                  placeholder="Ex: 12A" 
                  className="w-full p-2 border rounded bg-background" 
                />
              </div>
            </div>
            <button 
              onClick={handleAddPassenger} 
              disabled={loading}
              className="bg-secondary text-white px-4 py-2 rounded-lg font-medium hover:bg-secondary/90"
            >
              {loading ? "Adicionando..." : "+ Adicionar Passageiro"}
            </button>
          </div>

          <div className="p-6 border rounded-xl bg-card shadow-sm">
            <h3 className="text-md font-semibold mb-4">Passageiros Adicionados</h3>
            <div className="space-y-2">
              {passengers.map((p, i) => (
                <div key={i} className="flex justify-between p-3 border rounded bg-muted/30">
                  <span>{p.passenger_name_snapshot}</span>
                  <span className="font-mono font-bold">R$ {p.sale_price}</span>
                </div>
              ))}
              {passengers.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhum passageiro adicionado.</p>}
            </div>
            <button 
              onClick={() => setStep(3)} 
              disabled={passengers.length === 0}
              className="w-full mt-6 bg-primary text-white p-3 rounded-lg font-bold"
            >
              Finalizar e Revisar
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="p-6 border rounded-xl bg-card shadow-sm space-y-6">
          <h2 className="text-lg font-semibold">Passo 3: RevisÃ£o Final</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span>Viagem:</span>
              <span className="font-bold">{trips.find(t => t.id === tripId)?.title}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Cliente:</span>
              <span className="font-bold">{customers.find(c => c.id === customerId)?.full_name}</span>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Passageiros:</p>
              {passengers.map((p, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{p.passenger_name_snapshot}</span>
                  <span>R$ {p.sale_price}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t">
              <span>Total da Reserva:</span>
              <span className="text-primary">R$ {passengers.reduce((acc, p) => acc + Number(p.sale_price), 0)}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep(2)} className="flex-1 border p-3 rounded-lg">Voltar</button>
            <button 
              onClick={handleFinalize} 
              disabled={loading}
              className="flex-1 bg-primary text-white p-3 rounded-lg font-bold"
            >
              {loading ? "Confirmando..." : "Confirmar Reserva"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
