import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  getLeadById,
  getLeads,
  createLead as svcCreateLead,
  updateLead as svcUpdateLead,
  deleteLead as svcDeleteLead,
} from "../services/leadService";
import type { Lead as ApiLead } from "../types/lead";

export type Lead = ApiLead;

interface LeadState {
  leads: Lead[];
  selectedLead: Lead | null;
  loading: boolean;
  error: string | null;

  fetchLeads: () => Promise<void>;
  fetchLeadById: (id: number | string) => Promise<void>;
  addLead: (lead: Omit<Lead, "id">) => Promise<void>;
  updateLead: (id: number | string, updated: Partial<Lead>) => Promise<void>;
  deleteLead: (id: number | string) => Promise<void>;
  clearSelected: () => void;
}

export const useLeadStore = create<LeadState>()(
  devtools(
    persist(
      (set, get) => ({
        leads: [],
        selectedLead: null,
        loading: false,
        error: null,

        fetchLeads: async () => {
          set({ loading: true });
          try {
            const data = await getLeads();
            set({ leads: data, loading: false });
          } catch (err) {
            console.log(err);
            set({ error: "Failed to fetch leads", loading: false });
          }
        },

        fetchLeadById: async (id) => {
          set({ loading: true });
          try {
            const data = await getLeadById(id);
            set({ selectedLead: data, loading: false });
          } catch (err) {
            console.error(err);
            set({ error: "Failed to fetch lead", loading: false });
          }
        },

        addLead: async (lead) => {
          try {
            await svcCreateLead(lead);
            await get().fetchLeads();
          } catch (err) {
            console.error(err);
            set({ error: "Failed to add lead" });
          }
        },

        updateLead: async (id, updated) => {
          try {
            await svcUpdateLead(Number(id), updated as Partial<ApiLead>);
            await get().fetchLeads();
            await get().fetchLeadById(id);
          } catch (err) {
            console.error(err);
            set({ error: "Failed to update lead" });
          }
        },

        deleteLead: async (id) => {
          try {
            await svcDeleteLead(Number(id));
            await get().fetchLeads();
          } catch (err) {
            console.error(err);
            set({ error: "Failed to delete lead" });
          }
        },

        clearSelected: () => set({ selectedLead: null }),
      }),
      {
        name: "lead-storage",
      },
    ),
  ),
);
