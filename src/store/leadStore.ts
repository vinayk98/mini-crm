import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface Lead {
  id: number;
  name: string;
  phone: string;
  source: string;
  status: string;
  createdAt: string;
  assignedTo?: string;
}

interface LeadState {
  leads: Lead[];
  selectedLead: Lead | null;
  loading: boolean;
  error: string | null;

  fetchLeads: () => Promise<void>;
  fetchLeadById: (id: number) => Promise<void>;
  addLead: (lead: Omit<Lead, "id">) => Promise<void>;
  updateLead: (id: number, updated: Partial<Lead>) => Promise<void>;
  deleteLead: (id: number) => Promise<void>;
  clearSelected: () => void;
}

export const useLeadStore = create<LeadState>()(
  devtools(
    persist(
      (set) => ({
        leads: [],
        selectedLead: null,
        loading: false,
        error: null,

        fetchLeads: async () => {
          set({ loading: true });
          try {
            const res = await fetch("http://localhost:3001/leads");
            const data = await res.json();
            set({ leads: data, loading: false });
          } catch (err) {
            console.log(err);
            set({ error: "Failed to fetch leads", loading: false });
          }
        },

        fetchLeadById: async (id) => {
          set({ loading: true });
          try {
            const res = await fetch(`http://localhost:3001/leads/${id}`);
            const data = await res.json();
            set({ selectedLead: data, loading: false });
          } catch {
            set({ error: "Failed to fetch lead", loading: false });
          }
        },

        addLead: async (lead) => {
          try {
            const res = await fetch("http://localhost:3001/leads", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(lead),
            });

            const data = await res.json();
            set((state) => ({
              leads: [...state.leads, data],
            }));
          } catch {
            set({ error: "Failed to add lead" });
          }
        },

        updateLead: async (id, updated) => {
          try {
            const res = await fetch(`http://localhost:3001/leads/${id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updated),
            });

            const data = await res.json();

            set((state) => ({
              leads: state.leads.map((l) => (l.id === id ? data : l)),
              selectedLead: data,
            }));
          } catch {
            set({ error: "Failed to update lead" });
          }
        },

        deleteLead: async (id) => {
          try {
            await fetch(`http://localhost:3001/leads/${id}`, {
              method: "DELETE",
            });

            set((state) => ({
              leads: state.leads.filter((l) => l.id !== id),
            }));
          } catch {
            set({ error: "Failed to delete lead" });
          }
        },

        clearSelected: () => set({ selectedLead: null }),
      }),
      {
        name: "lead-storage", // localStorage key
      },
    ),
  ),
);
