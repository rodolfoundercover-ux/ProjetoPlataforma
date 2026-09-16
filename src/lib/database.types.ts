export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  internal: {
    Tables: {
      outbox: {
        Row: {
          agency_id: string | null
          created_at: string
          dispatched_at: string | null
          event_type: string
          id: string
          idempotency_key: string
          payload: Json
          scope: string
        }
        Insert: {
          agency_id?: string | null
          created_at?: string
          dispatched_at?: string | null
          event_type: string
          id?: string
          idempotency_key: string
          payload?: Json
          scope: string
        }
        Update: {
          agency_id?: string | null
          created_at?: string
          dispatched_at?: string | null
          event_type?: string
          id?: string
          idempotency_key?: string
          payload?: Json
          scope?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string
          id: string
          legal_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          legal_name: string
        }
        Update: {
          created_at?: string
          id?: string
          legal_name?: string
        }
        Relationships: []
      }
      agencies: {
        Row: {
          account_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          account_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          account_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "agencies_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_audit_events: {
        Row: {
          action: string
          actor_user_id: string | null
          agency_id: string
          created_at: string
          details: Json
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          agency_id: string
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          agency_id?: string
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_audit_events_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_boarding_locations: {
        Row: {
          active: boolean
          address: string
          advance_minutes: number | null
          agency_id: string
          created_at: string
          id: string
          name: string
          tolerance_minutes: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          address: string
          advance_minutes?: number | null
          agency_id: string
          created_at?: string
          id?: string
          name: string
          tolerance_minutes?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string
          advance_minutes?: number | null
          agency_id?: string
          created_at?: string
          id?: string
          name?: string
          tolerance_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_boarding_locations_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_branding: {
        Row: {
          agency_id: string
          font_family: string
          logo_url: string | null
          primary_color: string
          secondary_color: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          font_family?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          font_family?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_branding_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: true
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_customers: {
        Row: {
          agency_id: string
          archived_at: string | null
          auth_user_id: string | null
          birth_date: string | null
          created_at: string
          display_name: string | null
          document: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          archived_at?: string | null
          auth_user_id?: string | null
          birth_date?: string | null
          created_at?: string
          display_name?: string | null
          document?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          archived_at?: string | null
          auth_user_id?: string | null
          birth_date?: string | null
          created_at?: string
          display_name?: string | null
          document?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_customers_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_domains: {
        Row: {
          agency_id: string
          created_at: string
          hostname: string
          id: string
          is_platform_subdomain: boolean
          is_primary: boolean
          ssl_status: Database["public"]["Enums"]["ssl_status"]
          status: Database["public"]["Enums"]["domain_status"]
          updated_at: string
          verification_token_hash: string | null
          verified_at: string | null
        }
        Insert: {
          agency_id: string
          created_at?: string
          hostname: string
          id?: string
          is_platform_subdomain?: boolean
          is_primary?: boolean
          ssl_status?: Database["public"]["Enums"]["ssl_status"]
          status?: Database["public"]["Enums"]["domain_status"]
          updated_at?: string
          verification_token_hash?: string | null
          verified_at?: string | null
        }
        Update: {
          agency_id?: string
          created_at?: string
          hostname?: string
          id?: string
          is_platform_subdomain?: boolean
          is_primary?: boolean
          ssl_status?: Database["public"]["Enums"]["ssl_status"]
          status?: Database["public"]["Enums"]["domain_status"]
          updated_at?: string
          verification_token_hash?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_domains_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_features: {
        Row: {
          agency_id: string
          enabled: boolean
          feature_key: string
        }
        Insert: {
          agency_id: string
          enabled?: boolean
          feature_key: string
        }
        Update: {
          agency_id?: string
          enabled?: boolean
          feature_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_features_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_features_feature_key_fkey"
            columns: ["feature_key"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["key"]
          },
        ]
      }
      agency_integrations: {
        Row: {
          agency_id: string
          credential_reference: string | null
          id: string
          provider: string
          status: Database["public"]["Enums"]["integration_status"]
          updated_at: string
        }
        Insert: {
          agency_id: string
          credential_reference?: string | null
          id?: string
          provider: string
          status?: Database["public"]["Enums"]["integration_status"]
          updated_at?: string
        }
        Update: {
          agency_id?: string
          credential_reference?: string | null
          id?: string
          provider?: string
          status?: Database["public"]["Enums"]["integration_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_integrations_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_invitations: {
        Row: {
          accepted_at: string | null
          agency_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          member_role: Database["public"]["Enums"]["member_role"]
          revoked_at: string | null
          status: Database["public"]["Enums"]["invitation_status"]
          token_hash: string
        }
        Insert: {
          accepted_at?: string | null
          agency_id: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by: string
          member_role?: Database["public"]["Enums"]["member_role"]
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["invitation_status"]
          token_hash: string
        }
        Update: {
          accepted_at?: string | null
          agency_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          member_role?: Database["public"]["Enums"]["member_role"]
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["invitation_status"]
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_invitations_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_member_permissions: {
        Row: {
          agency_member_id: string
          permission_key: string
        }
        Insert: {
          agency_member_id: string
          permission_key: string
        }
        Update: {
          agency_member_id?: string
          permission_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_member_permissions_agency_member_id_fkey"
            columns: ["agency_member_id"]
            isOneToOne: false
            referencedRelation: "agency_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_member_permissions_permission_key_fkey"
            columns: ["permission_key"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["key"]
          },
        ]
      }
      agency_members: {
        Row: {
          agency_id: string
          created_at: string
          id: string
          profile_id: string | null
          role: Database["public"]["Enums"]["member_role"]
          status: Database["public"]["Enums"]["member_status"]
          user_id: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          id?: string
          profile_id?: string | null
          role: Database["public"]["Enums"]["member_role"]
          status?: Database["public"]["Enums"]["member_status"]
          user_id: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          id?: string
          profile_id?: string | null
          role?: Database["public"]["Enums"]["member_role"]
          status?: Database["public"]["Enums"]["member_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_members_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_members_profile_id_agency_id_fkey"
            columns: ["profile_id", "agency_id"]
            isOneToOne: false
            referencedRelation: "permission_profiles"
            referencedColumns: ["id", "agency_id"]
          },
        ]
      }
      agency_passengers: {
        Row: {
          agency_id: string
          birth_date: string
          created_at: string
          document: string
          full_name: string
          id: string
          linked_auth_user_id: string | null
          owner_customer_id: string | null
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          birth_date: string
          created_at?: string
          document: string
          full_name: string
          id?: string
          linked_auth_user_id?: string | null
          owner_customer_id?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          birth_date?: string
          created_at?: string
          document?: string
          full_name?: string
          id?: string
          linked_auth_user_id?: string | null
          owner_customer_id?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_passengers_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agency_passengers_agency_id_owner_customer_id_fkey"
            columns: ["agency_id", "owner_customer_id"]
            isOneToOne: false
            referencedRelation: "agency_customers"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      agency_settings: {
        Row: {
          agency_id: string
          cadastur: string | null
          commercial_rules: Json
          contact_email: string | null
          contact_phone: string | null
          legal_name: string
          timezone: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          cadastur?: string | null
          commercial_rules?: Json
          contact_email?: string | null
          contact_phone?: string | null
          legal_name: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          cadastur?: string | null
          commercial_rules?: Json
          contact_email?: string | null
          contact_phone?: string | null
          legal_name?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_settings_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: true
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_requests: {
        Row: {
          agency_id: string
          context_hash: string
          created_at: string
          decided_at: string | null
          decided_by: string | null
          expires_at: string
          id: string
          list_price: number
          passenger_id: string | null
          reason: string
          requested_by: string
          requested_sale_price: number
          reservation_id: string
          status: string
        }
        Insert: {
          agency_id: string
          context_hash: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          expires_at: string
          id?: string
          list_price: number
          passenger_id?: string | null
          reason: string
          requested_by: string
          requested_sale_price: number
          reservation_id: string
          status?: string
        }
        Update: {
          agency_id?: string
          context_hash?: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          expires_at?: string
          id?: string
          list_price?: number
          passenger_id?: string | null
          reason?: string
          requested_by?: string
          requested_sale_price?: number
          reservation_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_agency_id_reservation_id_fkey"
            columns: ["agency_id", "reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      charges: {
        Row: {
          agency_id: string
          amount: number
          cancelled_at: string | null
          charge_type: Database["public"]["Enums"]["charge_type"]
          created_at: string
          due_date: string | null
          id: string
          paid_at: string | null
          reservation_id: string
          status: Database["public"]["Enums"]["charge_status"]
        }
        Insert: {
          agency_id: string
          amount: number
          cancelled_at?: string | null
          charge_type: Database["public"]["Enums"]["charge_type"]
          created_at?: string
          due_date?: string | null
          id?: string
          paid_at?: string | null
          reservation_id: string
          status?: Database["public"]["Enums"]["charge_status"]
        }
        Update: {
          agency_id?: string
          amount?: number
          cancelled_at?: string | null
          charge_type?: Database["public"]["Enums"]["charge_type"]
          created_at?: string
          due_date?: string | null
          id?: string
          paid_at?: string | null
          reservation_id?: string
          status?: Database["public"]["Enums"]["charge_status"]
        }
        Relationships: [
          {
            foreignKeyName: "charges_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charges_agency_id_reservation_id_fkey"
            columns: ["agency_id", "reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      features: {
        Row: {
          created_at: string
          description: string
          key: string
        }
        Insert: {
          created_at?: string
          description: string
          key: string
        }
        Update: {
          created_at?: string
          description?: string
          key?: string
        }
        Relationships: []
      }
      licenses: {
        Row: {
          account_id: string
          agency_id: string
          created_at: string
          id: string
          plan_id: string | null
          status: Database["public"]["Enums"]["license_status"]
        }
        Insert: {
          account_id: string
          agency_id: string
          created_at?: string
          id?: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["license_status"]
        }
        Update: {
          account_id?: string
          agency_id?: string
          created_at?: string
          id?: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["license_status"]
        }
        Relationships: [
          {
            foreignKeyName: "licenses_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "licenses_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: true
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "licenses_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      passenger_categories: {
        Row: {
          active: boolean
          agency_id: string
          created_at: string
          id: string
          max_age: number | null
          min_age: number | null
          name: string
          occupies_seat_default: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          agency_id: string
          created_at?: string
          id?: string
          max_age?: number | null
          min_age?: number | null
          name: string
          occupies_seat_default?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          agency_id?: string
          created_at?: string
          id?: string
          max_age?: number | null
          min_age?: number | null
          name?: string
          occupies_seat_default?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "passenger_categories_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_adjustments: {
        Row: {
          adjustment_type: string
          agency_id: string
          amount: number
          created_at: string
          created_by: string | null
          id: string
          payment_id: string
          reason: string
        }
        Insert: {
          adjustment_type: string
          agency_id: string
          amount: number
          created_at?: string
          created_by?: string | null
          id?: string
          payment_id: string
          reason: string
        }
        Update: {
          adjustment_type?: string
          agency_id?: string
          amount?: number
          created_at?: string
          created_by?: string | null
          id?: string
          payment_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_adjustments_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_adjustments_agency_id_payment_id_fkey"
            columns: ["agency_id", "payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      payment_allocations: {
        Row: {
          agency_id: string
          amount: number
          charge_id: string
          created_at: string
          id: string
          payment_id: string
        }
        Insert: {
          agency_id: string
          amount: number
          charge_id: string
          created_at?: string
          id?: string
          payment_id: string
        }
        Update: {
          agency_id?: string
          amount?: number
          charge_id?: string
          created_at?: string
          id?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_allocations_agency_id_charge_id_fkey"
            columns: ["agency_id", "charge_id"]
            isOneToOne: false
            referencedRelation: "charges"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "payment_allocations_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_allocations_agency_id_payment_id_fkey"
            columns: ["agency_id", "payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      payment_reconciliation_exceptions: {
        Row: {
          agency_id: string
          code: string
          created_at: string
          id: string
          payment_id: string
          reservation_id: string
          resolved_at: string | null
        }
        Insert: {
          agency_id: string
          code: string
          created_at?: string
          id?: string
          payment_id: string
          reservation_id: string
          resolved_at?: string | null
        }
        Update: {
          agency_id?: string
          code?: string
          created_at?: string
          id?: string
          payment_id?: string
          reservation_id?: string
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_reconciliation_exceptions_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_reconciliation_exceptions_agency_id_payment_id_fkey"
            columns: ["agency_id", "payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "payment_reconciliation_exceptions_agency_id_reservation_id_fkey"
            columns: ["agency_id", "reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          agency_id: string
          amount: number
          created_at: string
          external_reference: string
          id: string
          occurred_at: string | null
          payment_id: string
          provider: Database["public"]["Enums"]["payment_provider"]
          status: Database["public"]["Enums"]["payment_status"]
        }
        Insert: {
          agency_id: string
          amount: number
          created_at?: string
          external_reference: string
          id?: string
          occurred_at?: string | null
          payment_id: string
          provider: Database["public"]["Enums"]["payment_provider"]
          status: Database["public"]["Enums"]["payment_status"]
        }
        Update: {
          agency_id?: string
          amount?: number
          created_at?: string
          external_reference?: string
          id?: string
          occurred_at?: string | null
          payment_id?: string
          provider?: Database["public"]["Enums"]["payment_provider"]
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_agency_id_payment_id_fkey"
            columns: ["agency_id", "payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      payment_webhook_events: {
        Row: {
          error_code: string | null
          external_event_id: string
          id: string
          payload_digest: string
          payment_id: string | null
          processed_at: string | null
          processing_status: Database["public"]["Enums"]["webhook_processing_status"]
          provider: Database["public"]["Enums"]["payment_provider"]
          received_at: string
        }
        Insert: {
          error_code?: string | null
          external_event_id: string
          id?: string
          payload_digest: string
          payment_id?: string | null
          processed_at?: string | null
          processing_status?: Database["public"]["Enums"]["webhook_processing_status"]
          provider: Database["public"]["Enums"]["payment_provider"]
          received_at?: string
        }
        Update: {
          error_code?: string | null
          external_event_id?: string
          id?: string
          payload_digest?: string
          payment_id?: string | null
          processed_at?: string | null
          processing_status?: Database["public"]["Enums"]["webhook_processing_status"]
          provider?: Database["public"]["Enums"]["payment_provider"]
          received_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          account_scope: Database["public"]["Enums"]["payment_account_scope"]
          agency_fee_amount: number
          agency_id: string
          amount: number
          client_fee_amount: number
          confirmed_at: string | null
          created_at: string
          created_by: string | null
          id: string
          idempotency_key: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_payment_id: string | null
          rejected_at: string | null
          reservation_id: string
          status: Database["public"]["Enums"]["payment_status"]
        }
        Insert: {
          account_scope?: Database["public"]["Enums"]["payment_account_scope"]
          agency_fee_amount?: number
          agency_id: string
          amount: number
          client_fee_amount?: number
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          idempotency_key: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_payment_id?: string | null
          rejected_at?: string | null
          reservation_id: string
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Update: {
          account_scope?: Database["public"]["Enums"]["payment_account_scope"]
          agency_fee_amount?: number
          agency_id?: string
          amount?: number
          client_fee_amount?: number
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          idempotency_key?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_payment_id?: string | null
          rejected_at?: string | null
          reservation_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payments_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_agency_id_reservation_id_fkey"
            columns: ["agency_id", "reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      permission_profile_permissions: {
        Row: {
          permission_key: string
          profile_id: string
        }
        Insert: {
          permission_key: string
          profile_id: string
        }
        Update: {
          permission_key?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permission_profile_permissions_permission_key_fkey"
            columns: ["permission_key"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "permission_profile_permissions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "permission_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permission_profiles: {
        Row: {
          agency_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "permission_profiles_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string
          key: string
        }
        Insert: {
          created_at?: string
          description: string
          key: string
        }
        Update: {
          created_at?: string
          description?: string
          key?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      platform_admins: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reservation_passengers: {
        Row: {
          agency_id: string
          birth_date_snapshot: string
          boarding_point_id: string
          boarding_snapshot: string
          cancelled_at: string | null
          category_id: string
          category_name_snapshot: string
          created_at: string
          discount_amount: number | null
          document_snapshot: string
          id: string
          list_price: number
          occupies_seat: boolean
          passenger_id: string | null
          passenger_name_snapshot: string
          reservation_id: string
          sale_price: number
          status: string
          trip_id: string
        }
        Insert: {
          agency_id: string
          birth_date_snapshot: string
          boarding_point_id: string
          boarding_snapshot: string
          cancelled_at?: string | null
          category_id: string
          category_name_snapshot: string
          created_at?: string
          discount_amount?: number | null
          document_snapshot: string
          id?: string
          list_price: number
          occupies_seat: boolean
          passenger_id?: string | null
          passenger_name_snapshot: string
          reservation_id: string
          sale_price: number
          status?: string
          trip_id: string
        }
        Update: {
          agency_id?: string
          birth_date_snapshot?: string
          boarding_point_id?: string
          boarding_snapshot?: string
          cancelled_at?: string | null
          category_id?: string
          category_name_snapshot?: string
          created_at?: string
          discount_amount?: number | null
          document_snapshot?: string
          id?: string
          list_price?: number
          occupies_seat?: boolean
          passenger_id?: string | null
          passenger_name_snapshot?: string
          reservation_id?: string
          sale_price?: number
          status?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservation_passengers_agency_id_boarding_point_id_fkey"
            columns: ["agency_id", "boarding_point_id"]
            isOneToOne: false
            referencedRelation: "trip_boarding_points"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "reservation_passengers_agency_id_category_id_fkey"
            columns: ["agency_id", "category_id"]
            isOneToOne: false
            referencedRelation: "passenger_categories"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "reservation_passengers_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_passengers_agency_id_passenger_id_fkey"
            columns: ["agency_id", "passenger_id"]
            isOneToOne: false
            referencedRelation: "agency_passengers"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "reservation_passengers_agency_id_reservation_id_fkey"
            columns: ["agency_id", "reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "reservation_passengers_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "public_trip_catalog"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "reservation_passengers_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      reservation_payment_deadline_exceptions: {
        Row: {
          agency_id: string
          allowed_until: string
          approved_by: string
          created_at: string
          id: string
          reason: string
          reservation_id: string
          revoked_at: string | null
        }
        Insert: {
          agency_id: string
          allowed_until: string
          approved_by: string
          created_at?: string
          id?: string
          reason: string
          reservation_id: string
          revoked_at?: string | null
        }
        Update: {
          agency_id?: string
          allowed_until?: string
          approved_by?: string
          created_at?: string
          id?: string
          reason?: string
          reservation_id?: string
          revoked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservation_payment_deadline_exce_agency_id_reservation_id_fkey"
            columns: ["agency_id", "reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "reservation_payment_deadline_exceptions_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          agency_id: string
          buyer_customer_id: string
          cancelled_at: string | null
          code: string
          commercial_source: string
          confirmed_at: string | null
          created_at: string
          created_by: string
          currency: string
          discount_total: number
          entry_amount: number
          expired_at: string | null
          expires_at: string
          financial_status: Database["public"]["Enums"]["reservation_financial_status"]
          id: string
          sales_channel: string
          status: Database["public"]["Enums"]["reservation_status"]
          subtotal: number
          total_amount: number
          trip_id: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          buyer_customer_id: string
          cancelled_at?: string | null
          code: string
          commercial_source: string
          confirmed_at?: string | null
          created_at?: string
          created_by: string
          currency?: string
          discount_total?: number
          entry_amount?: number
          expired_at?: string | null
          expires_at: string
          financial_status?: Database["public"]["Enums"]["reservation_financial_status"]
          id?: string
          sales_channel: string
          status?: Database["public"]["Enums"]["reservation_status"]
          subtotal?: number
          total_amount?: number
          trip_id: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          buyer_customer_id?: string
          cancelled_at?: string | null
          code?: string
          commercial_source?: string
          confirmed_at?: string | null
          created_at?: string
          created_by?: string
          currency?: string
          discount_total?: number
          entry_amount?: number
          expired_at?: string | null
          expires_at?: string
          financial_status?: Database["public"]["Enums"]["reservation_financial_status"]
          id?: string
          sales_channel?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          subtotal?: number
          total_amount?: number
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_agency_id_buyer_customer_id_fkey"
            columns: ["agency_id", "buyer_customer_id"]
            isOneToOne: false
            referencedRelation: "agency_customers"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "reservations_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "public_trip_catalog"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "reservations_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      sales_attributions: {
        Row: {
          agency_id: string
          channel: string
          created_at: string
          id: string
          reservation_id: string
          source: string
        }
        Insert: {
          agency_id: string
          channel: string
          created_at?: string
          id?: string
          reservation_id: string
          source: string
        }
        Update: {
          agency_id?: string
          channel?: string
          created_at?: string
          id?: string
          reservation_id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_attributions_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_attributions_agency_id_reservation_id_fkey"
            columns: ["agency_id", "reservation_id"]
            isOneToOne: true
            referencedRelation: "reservations"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      seat_assignments: {
        Row: {
          agency_id: string
          assigned_at: string
          id: string
          release_reason: string | null
          released_at: string | null
          reservation_passenger_id: string
          seat_id: string
          trip_id: string
        }
        Insert: {
          agency_id: string
          assigned_at?: string
          id?: string
          release_reason?: string | null
          released_at?: string | null
          reservation_passenger_id: string
          seat_id: string
          trip_id: string
        }
        Update: {
          agency_id?: string
          assigned_at?: string
          id?: string
          release_reason?: string | null
          released_at?: string | null
          reservation_passenger_id?: string
          seat_id?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seat_assignments_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_assignments_agency_id_reservation_passenger_id_fkey"
            columns: ["agency_id", "reservation_passenger_id"]
            isOneToOne: false
            referencedRelation: "reservation_passengers"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "seat_assignments_agency_id_seat_id_fkey"
            columns: ["agency_id", "seat_id"]
            isOneToOne: false
            referencedRelation: "trip_seats"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      seat_holds: {
        Row: {
          agency_id: string
          created_at: string
          created_by: string
          expires_at: string
          id: string
          reservation_id: string
          seat_id: string | null
          trip_id: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          created_by: string
          expires_at: string
          id?: string
          reservation_id: string
          seat_id?: string | null
          trip_id: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          created_by?: string
          expires_at?: string
          id?: string
          reservation_id?: string
          seat_id?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seat_holds_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_holds_agency_id_reservation_id_fkey"
            columns: ["agency_id", "reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "seat_holds_agency_id_seat_id_fkey"
            columns: ["agency_id", "seat_id"]
            isOneToOne: false
            referencedRelation: "trip_seats"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "seat_holds_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "public_trip_catalog"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "seat_holds_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      site_trip_publications: {
        Row: {
          agency_id: string
          published_at: string | null
          status: Database["public"]["Enums"]["site_publication_status"]
          trip_id: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["site_publication_status"]
          trip_id: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["site_publication_status"]
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "site_trip_publications_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "public_trip_catalog"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "site_trip_publications_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      transport_suppliers: {
        Row: {
          active: boolean
          agency_id: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          agency_id: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          agency_id?: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_suppliers_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_boarding_points: {
        Row: {
          address_snapshot: string
          advance_minutes: number | null
          agency_id: string
          boarding_at: string
          id: string
          name_snapshot: string
          sort_order: number
          source_location_id: string | null
          tolerance_minutes: number | null
          trip_id: string
        }
        Insert: {
          address_snapshot: string
          advance_minutes?: number | null
          agency_id: string
          boarding_at: string
          id?: string
          name_snapshot: string
          sort_order?: number
          source_location_id?: string | null
          tolerance_minutes?: number | null
          trip_id: string
        }
        Update: {
          address_snapshot?: string
          advance_minutes?: number | null
          agency_id?: string
          boarding_at?: string
          id?: string
          name_snapshot?: string
          sort_order?: number
          source_location_id?: string | null
          tolerance_minutes?: number | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_boarding_points_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "public_trip_catalog"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "trip_boarding_points_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "trip_boarding_points_source_location_id_agency_id_fkey"
            columns: ["source_location_id", "agency_id"]
            isOneToOne: false
            referencedRelation: "agency_boarding_locations"
            referencedColumns: ["id", "agency_id"]
          },
        ]
      }
      trip_content: {
        Row: {
          agency_id: string
          description: string
          excluded_items: string[]
          included_items: string[]
          insurance_included: boolean
          trip_id: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          description?: string
          excluded_items?: string[]
          included_items?: string[]
          insurance_included?: boolean
          trip_id: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          description?: string
          excluded_items?: string[]
          included_items?: string[]
          insurance_included?: boolean
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_content_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "public_trip_catalog"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "trip_content_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      trip_costs: {
        Row: {
          actual_amount: number | null
          agency_id: string
          allocation_type: Database["public"]["Enums"]["cost_allocation_type"]
          category: string
          confirmed_amount: number | null
          cost_type: Database["public"]["Enums"]["trip_cost_type"]
          created_at: string
          description: string
          estimated_amount: number
          id: string
          supplier_name: string | null
          trip_id: string
          updated_at: string
        }
        Insert: {
          actual_amount?: number | null
          agency_id: string
          allocation_type: Database["public"]["Enums"]["cost_allocation_type"]
          category: string
          confirmed_amount?: number | null
          cost_type: Database["public"]["Enums"]["trip_cost_type"]
          created_at?: string
          description: string
          estimated_amount: number
          id?: string
          supplier_name?: string | null
          trip_id: string
          updated_at?: string
        }
        Update: {
          actual_amount?: number | null
          agency_id?: string
          allocation_type?: Database["public"]["Enums"]["cost_allocation_type"]
          category?: string
          confirmed_amount?: number | null
          cost_type?: Database["public"]["Enums"]["trip_cost_type"]
          created_at?: string
          description?: string
          estimated_amount?: number
          id?: string
          supplier_name?: string | null
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_costs_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "public_trip_catalog"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "trip_costs_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      trip_images: {
        Row: {
          agency_id: string
          alt_text: string
          created_at: string
          id: string
          mime_type: string
          size_bytes: number
          sort_order: number
          storage_path: string
          trip_id: string
        }
        Insert: {
          agency_id: string
          alt_text: string
          created_at?: string
          id?: string
          mime_type: string
          size_bytes: number
          sort_order?: number
          storage_path: string
          trip_id: string
        }
        Update: {
          agency_id?: string
          alt_text?: string
          created_at?: string
          id?: string
          mime_type?: string
          size_bytes?: number
          sort_order?: number
          storage_path?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_images_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "public_trip_catalog"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "trip_images_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      trip_itinerary_items: {
        Row: {
          agency_id: string
          day_number: number
          description: string
          id: string
          sort_order: number
          title: string
          trip_id: string
        }
        Insert: {
          agency_id: string
          day_number: number
          description?: string
          id?: string
          sort_order?: number
          title: string
          trip_id: string
        }
        Update: {
          agency_id?: string
          day_number?: number
          description?: string
          id?: string
          sort_order?: number
          title?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_itinerary_items_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "public_trip_catalog"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "trip_itinerary_items_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      trip_passenger_prices: {
        Row: {
          active: boolean
          agency_id: string
          id: string
          list_price: number
          minimum_price_without_approval: number | null
          occupies_seat: boolean
          passenger_category_id: string
          trip_id: string
        }
        Insert: {
          active?: boolean
          agency_id: string
          id?: string
          list_price: number
          minimum_price_without_approval?: number | null
          occupies_seat: boolean
          passenger_category_id: string
          trip_id: string
        }
        Update: {
          active?: boolean
          agency_id?: string
          id?: string
          list_price?: number
          minimum_price_without_approval?: number | null
          occupies_seat?: boolean
          passenger_category_id?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_passenger_prices_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "public_trip_catalog"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "trip_passenger_prices_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "trip_passenger_prices_passenger_category_id_agency_id_fkey"
            columns: ["passenger_category_id", "agency_id"]
            isOneToOne: false
            referencedRelation: "passenger_categories"
            referencedColumns: ["id", "agency_id"]
          },
        ]
      }
      trip_seats: {
        Row: {
          active: boolean
          agency_id: string
          assignment_id: string
          blocked: boolean
          id: string
          label: string
          requires_review: boolean
          trip_id: string
        }
        Insert: {
          active?: boolean
          agency_id: string
          assignment_id: string
          blocked?: boolean
          id?: string
          label: string
          requires_review?: boolean
          trip_id: string
        }
        Update: {
          active?: boolean
          agency_id?: string
          assignment_id?: string
          blocked?: boolean
          id?: string
          label?: string
          requires_review?: boolean
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_seats_agency_id_assignment_id_fkey"
            columns: ["agency_id", "assignment_id"]
            isOneToOne: false
            referencedRelation: "trip_vehicle_assignments"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "trip_seats_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "public_trip_catalog"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "trip_seats_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      trip_vehicle_assignments: {
        Row: {
          actual_cost: number | null
          agency_id: string
          capacity_snapshot: number
          confirmed_cost: number | null
          created_by: string
          ended_at: string | null
          estimated_cost: number | null
          id: string
          reason: string
          started_at: string
          supplier_id: string | null
          trip_id: string
          vehicle_template_id: string | null
        }
        Insert: {
          actual_cost?: number | null
          agency_id: string
          capacity_snapshot: number
          confirmed_cost?: number | null
          created_by: string
          ended_at?: string | null
          estimated_cost?: number | null
          id?: string
          reason: string
          started_at?: string
          supplier_id?: string | null
          trip_id: string
          vehicle_template_id?: string | null
        }
        Update: {
          actual_cost?: number | null
          agency_id?: string
          capacity_snapshot?: number
          confirmed_cost?: number | null
          created_by?: string
          ended_at?: string | null
          estimated_cost?: number | null
          id?: string
          reason?: string
          started_at?: string
          supplier_id?: string | null
          trip_id?: string
          vehicle_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_vehicle_assignments_agency_id_supplier_id_fkey"
            columns: ["agency_id", "supplier_id"]
            isOneToOne: false
            referencedRelation: "transport_suppliers"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "trip_vehicle_assignments_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "public_trip_catalog"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "trip_vehicle_assignments_agency_id_trip_id_fkey"
            columns: ["agency_id", "trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["agency_id", "id"]
          },
          {
            foreignKeyName: "trip_vehicle_assignments_agency_id_vehicle_template_id_fkey"
            columns: ["agency_id", "vehicle_template_id"]
            isOneToOne: false
            referencedRelation: "vehicle_templates"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      trips: {
        Row: {
          agency_id: string
          archived_at: string | null
          category: string | null
          code: string
          contract_pending: boolean
          created_at: string
          created_by: string
          departure_at: string
          destination: string
          featured: boolean
          id: string
          minimum_passenger_decision_date: string | null
          minimum_passengers: number | null
          private: boolean
          return_at: string
          sales_end_at: string | null
          sales_start_at: string | null
          slug: string
          status: Database["public"]["Enums"]["trip_status"]
          title: string
          updated_at: string
        }
        Insert: {
          agency_id: string
          archived_at?: string | null
          category?: string | null
          code: string
          contract_pending?: boolean
          created_at?: string
          created_by: string
          departure_at: string
          destination: string
          featured?: boolean
          id?: string
          minimum_passenger_decision_date?: string | null
          minimum_passengers?: number | null
          private?: boolean
          return_at: string
          sales_end_at?: string | null
          sales_start_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["trip_status"]
          title: string
          updated_at?: string
        }
        Update: {
          agency_id?: string
          archived_at?: string | null
          category?: string | null
          code?: string
          contract_pending?: boolean
          created_at?: string
          created_by?: string
          departure_at?: string
          destination?: string
          featured?: boolean
          id?: string
          minimum_passenger_decision_date?: string | null
          minimum_passengers?: number | null
          private?: boolean
          return_at?: string
          sales_end_at?: string | null
          sales_start_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["trip_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_template_seats: {
        Row: {
          active: boolean
          agency_id: string
          blocked: boolean
          column_number: number | null
          id: string
          label: string
          row_number: number | null
          vehicle_template_id: string
        }
        Insert: {
          active?: boolean
          agency_id: string
          blocked?: boolean
          column_number?: number | null
          id?: string
          label: string
          row_number?: number | null
          vehicle_template_id: string
        }
        Update: {
          active?: boolean
          agency_id?: string
          blocked?: boolean
          column_number?: number | null
          id?: string
          label?: string
          row_number?: number | null
          vehicle_template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_template_seats_agency_id_vehicle_template_id_fkey"
            columns: ["agency_id", "vehicle_template_id"]
            isOneToOne: false
            referencedRelation: "vehicle_templates"
            referencedColumns: ["agency_id", "id"]
          },
        ]
      }
      vehicle_templates: {
        Row: {
          active: boolean
          agency_id: string
          capacity: number
          created_at: string
          has_seat_map: boolean
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          agency_id: string
          capacity: number
          created_at?: string
          has_seat_map?: boolean
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          agency_id?: string
          capacity?: number
          created_at?: string
          has_seat_map?: boolean
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_templates_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_trip_catalog: {
        Row: {
          agency_id: string | null
          departure_at: string | null
          description: string | null
          destination: string | null
          excluded_items: string[] | null
          featured: boolean | null
          id: string | null
          included_items: string[] | null
          return_at: string | null
          slug: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accept_agency_invitation: { Args: { raw_token: string }; Returns: string }
      add_reservation_passenger: {
        Args: {
          p_boarding: string
          p_passenger: string
          p_reservation: string
          p_sale_price: number
          p_seat?: string
        }
        Returns: string
      }
      age_on_date: {
        Args: { birth_date: string; reference_date: string }
        Returns: number
      }
      assign_trip_vehicle: {
        Args: {
          p_reason: string
          p_supplier: string
          p_template: string
          p_trip: string
        }
        Returns: string
      }
      authorize_reservation_payment_deadline: {
        Args: {
          p_allowed_until: string
          p_reason: string
          p_reservation: string
        }
        Returns: string
      }
      configure_reservation_balance: {
        Args: {
          p_first_due_date?: string
          p_installments: number
          p_reservation: string
        }
        Returns: number
      }
      configure_reservation_charges: {
        Args: {
          p_due_date?: string
          p_entry_amount: number
          p_reservation: string
        }
        Returns: string
      }
      create_manual_reservation: {
        Args: {
          p_buyer: string
          p_channel: string
          p_expires_at: string
          p_source: string
          p_trip: string
        }
        Returns: string
      }
      duplicate_trip: {
        Args: { p_code: string; p_slug: string; p_trip: string }
        Returns: string
      }
      expire_reservations: { Args: never; Returns: number }
      has_agency_permission: {
        Args: { required_key: string; target_agency: string }
        Returns: boolean
      }
      is_active_member: { Args: { target_agency: string }; Returns: boolean }
      is_agency_customer: { Args: { target_agency: string }; Returns: boolean }
      record_provider_confirmation: {
        Args: {
          p_amount: number
          p_external_event_id: string
          p_external_reference: string
          p_payload_digest: string
          p_payment_id: string
          p_provider: Database["public"]["Enums"]["payment_provider"]
        }
        Returns: string
      }
      refresh_charge_status: { Args: { p_charge: string }; Returns: undefined }
      refresh_reservation_financial_status: {
        Args: { p_reservation: string }
        Returns: undefined
      }
      register_cash_payment: {
        Args: { p_amount: number; p_charge: string; p_idempotency_key: string }
        Returns: string
      }
      resolve_verified_agency: {
        Args: { host_name: string }
        Returns: {
          agency_id: string
          hostname: string
        }[]
      }
      submit_reservation: {
        Args: { p_reservation: string }
        Returns: undefined
      }
      trip_price_for_birth_date: {
        Args: { p_birth_date: string; p_trip: string }
        Returns: {
          category_id: string
          list_price: number
          occupies_seat: boolean
        }[]
      }
    }
    Enums: {
      charge_status: "OPEN" | "PARTIALLY_PAID" | "PAID" | "CANCELLED"
      charge_type:
        | "ENTRY"
        | "INSTALLMENT"
        | "ADDITIONAL_CHARGE"
        | "CANCELLATION_FEE"
        | "PASSENGER_CHANGE_FEE"
        | "OTHER"
      cost_allocation_type:
        | "DIRECT_PER_PASSENGER"
        | "SHARED"
        | "FIXED_NO_ALLOCATION"
      domain_status: "PENDING" | "VERIFYING" | "VERIFIED" | "ERROR" | "DISABLED"
      integration_status:
        | "DISCONNECTED"
        | "CONNECTING"
        | "CONNECTED"
        | "DEGRADED"
        | "ERROR"
        | "DISABLED"
      invitation_status: "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED"
      license_status: "ACTIVE" | "SUSPENDED" | "CANCELLED"
      member_role: "ADMIN" | "ANALYST"
      member_status: "ACTIVE" | "INACTIVE"
      payment_account_scope: "AGENCY" | "MARKETPLACE"
      payment_method: "PIX" | "CARD" | "PAYMENT_LINK" | "CASH"
      payment_provider: "MERCADO_PAGO" | "INFINITE_PAY" | "CASH"
      payment_status:
        | "PENDING"
        | "CONFIRMED"
        | "REJECTED"
        | "REVERSED"
        | "REFUNDED"
        | "EXCEPTION"
      reservation_financial_status:
        | "PENDING"
        | "PARTIALLY_PAID"
        | "ENTRY_PAID"
        | "PAID"
        | "REFUNDED"
      reservation_status:
        | "DRAFT"
        | "WAITING_ENTRY"
        | "CONFIRMED"
        | "CANCELLED"
        | "EXPIRED"
        | "COMPLETED"
      site_publication_status: "DRAFT" | "PUBLISHED" | "UNPUBLISHED"
      ssl_status: "PENDING" | "ISSUING" | "ACTIVE" | "ERROR"
      trip_cost_type: "FIXED" | "PER_PASSENGER"
      trip_status:
        | "DRAFT"
        | "SALES_OPEN"
        | "SALES_CLOSED"
        | "CANCELLED"
        | "COMPLETED"
      webhook_processing_status: "RECEIVED" | "PROCESSED" | "IGNORED" | "FAILED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  internal: {
    Enums: {},
  },
  public: {
    Enums: {
      charge_status: ["OPEN", "PARTIALLY_PAID", "PAID", "CANCELLED"],
      charge_type: [
        "ENTRY",
        "INSTALLMENT",
        "ADDITIONAL_CHARGE",
        "CANCELLATION_FEE",
        "PASSENGER_CHANGE_FEE",
        "OTHER",
      ],
      cost_allocation_type: [
        "DIRECT_PER_PASSENGER",
        "SHARED",
        "FIXED_NO_ALLOCATION",
      ],
      domain_status: ["PENDING", "VERIFYING", "VERIFIED", "ERROR", "DISABLED"],
      integration_status: [
        "DISCONNECTED",
        "CONNECTING",
        "CONNECTED",
        "DEGRADED",
        "ERROR",
        "DISABLED",
      ],
      invitation_status: ["PENDING", "ACCEPTED", "EXPIRED", "REVOKED"],
      license_status: ["ACTIVE", "SUSPENDED", "CANCELLED"],
      member_role: ["ADMIN", "ANALYST"],
      member_status: ["ACTIVE", "INACTIVE"],
      payment_account_scope: ["AGENCY", "MARKETPLACE"],
      payment_method: ["PIX", "CARD", "PAYMENT_LINK", "CASH"],
      payment_provider: ["MERCADO_PAGO", "INFINITE_PAY", "CASH"],
      payment_status: [
        "PENDING",
        "CONFIRMED",
        "REJECTED",
        "REVERSED",
        "REFUNDED",
        "EXCEPTION",
      ],
      reservation_financial_status: [
        "PENDING",
        "PARTIALLY_PAID",
        "ENTRY_PAID",
        "PAID",
        "REFUNDED",
      ],
      reservation_status: [
        "DRAFT",
        "WAITING_ENTRY",
        "CONFIRMED",
        "CANCELLED",
        "EXPIRED",
        "COMPLETED",
      ],
      site_publication_status: ["DRAFT", "PUBLISHED", "UNPUBLISHED"],
      ssl_status: ["PENDING", "ISSUING", "ACTIVE", "ERROR"],
      trip_cost_type: ["FIXED", "PER_PASSENGER"],
      trip_status: [
        "DRAFT",
        "SALES_OPEN",
        "SALES_CLOSED",
        "CANCELLED",
        "COMPLETED",
      ],
      webhook_processing_status: ["RECEIVED", "PROCESSED", "IGNORED", "FAILED"],
    },
  },
} as const

