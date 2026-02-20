import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getAllNotes, createNote } from "../services/notePage";

export interface Note {
  id: number | string;
  leadId: number | string;
  content: string;
  createdBy: number;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;

  fetchNotes: (leadId: number | string) => Promise<void>;
  addNote: (data: Omit<Note, "id">) => Promise<Note | void>;
  clear: () => void;
}

export const useNotesStore = create<NotesState>()(
  devtools((set) => ({
    notes: [],
    loading: false,
    error: null,

    fetchNotes: async (leadId: number | string) => {
      if (!leadId) return;

      set({ loading: true, error: null });

      try {
        // fetch all notes and filter client-side by leadId
        const data = await getAllNotes();
  const filtered = (data || []).filter((n: Note) => String(n.leadId) === String(leadId));

        set({
          notes: filtered,
          loading: false,
        });
      } catch (err) {
        console.log(err);
        set({
          error: "Failed to fetch notes",
          loading: false,
        });
      }
    },

    addNote: async (payload) => {
      try {
        const created = await createNote(payload);

        // safer functional update
        set((state) => ({
          notes: [...state.notes, created],
        }));

        return created;
      } catch (err) {
        console.error(err);

        set({
          error: "Failed to add note",
        });
      }
    },

    clear: () =>
      set({
        notes: [],
        error: null,
      }),
  })),
);
