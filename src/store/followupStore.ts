import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getAllFollowUps, createFollowUp } from "../services/followup";
import { api } from "../services/api";

export interface FollowUp {
  id: number | string;
  leadId: number | string;
  date: string;
  status: string;
}

interface FollowupState {
  followups: FollowUp[];
  loading: boolean;
  error: string | null;
  fetchFollowUps: (leadId: number | string) => Promise<void>;
  addFollowUp: (data: Omit<FollowUp, "id">) => Promise<FollowUp | void>;
  markDone: (id: number | string, leadId: number | string) => Promise<void>;
  clear: () => void;
}

export const useFollowupStore = create<FollowupState>()(
  devtools((set, get) => ({
    followups: [],
    loading: false,
    error: null,

    fetchFollowUps: async (leadId) => {
      set({ loading: true });
      try {
        const data = await getAllFollowUps();
        const filtered = (data || []).filter((f: FollowUp) => String(f.leadId) === String(leadId));
        set({ followups: filtered, loading: false });
      } catch (err) {
        console.error(err);
        set({ error: "Failed to fetch followups", loading: false });
      }
    },

    addFollowUp: async (payload) => {
      try {
        const created = await createFollowUp(payload);
        set((state) => ({ followups: [...state.followups, created] }));
        return created;
      } catch (err) {
        console.error(err);
        set({ error: "Failed to create followup" });
      }
    },

    markDone: async (fid, leadId) => {
      try {
        await api.patch(`/followups/${fid}`, { status: "completed" });
        // refresh followups for the lead
        if (leadId) {
          await get().fetchFollowUps(leadId);
        }
      } catch (err) {
        console.error("Failed to mark followup done", err);
        set({ error: "Failed to update followup" });
      }
    },

    clear: () => set({ followups: [] }),
  })),
);
