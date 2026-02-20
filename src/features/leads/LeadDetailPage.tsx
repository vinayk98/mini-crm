import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getLeadById } from "../../services/leadService";
import { useNotesStore } from "../../store/notesStore";
import { useFollowupStore } from "../../store/followupStore";

interface Lead {
  id: number | string;
  name: string;
  email?: string;
  phone?: string;
  status?: string;
  assignedTo?: number | string;
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [noteLoading, setNoteLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "followups">("notes");
  const [noteText, setNoteText] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const notes = useNotesStore((s) => s.notes);
  const fetchNotes = useNotesStore((s) => s.fetchNotes);
  const addNote = useNotesStore((s) => s.addNote);

  const followups = useFollowupStore((s) => s.followups);
  const fetchFollowUps = useFollowupStore((s) => s.fetchFollowUps);
  const addFollowUp = useFollowupStore((s) => s.addFollowUp);
  const markFollowupDone = useFollowupStore((s) => s.markDone);
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const leadData = await getLeadById(id);
        setLead(leadData);
        await Promise.all([fetchNotes(String(id)), fetchFollowUps(String(id))]);
      } catch (err) {
        console.error("Error fetching lead detail:", err);
      }
    };

    fetchData();
  }, [id, fetchNotes, fetchFollowUps]);

  const handleAddNote = async () => {
    if (!noteText.trim() || !id) return;
    setNoteLoading(true);
    try {
      await addNote({
        leadId: String(id),
        content: noteText.trim(),
        createdBy: 1,
      });
      setNoteText("");
      await fetchNotes(String(id));
    } catch (err) {
      console.error("Error adding note:", err);
    } finally {
      setNoteLoading(false);
    }
  };

  const handleAddFollowUp = async () => {
    if (!followUpDate || !id) return;
    setFollowUpLoading(true);
    try {
      await addFollowUp({
        leadId: String(id),
        date: followUpDate,
        status: "pending",
      });
      setFollowUpDate("");
      await fetchFollowUps(id);
    } catch (err) {
      console.error("Error adding follow-up:", err);
    } finally {
      setFollowUpLoading(false);
    }
  };

  const handleMarkDone = async (fid: number | string) => {
    if (!id) return;
    try {
      await markFollowupDone(fid, id);
    } catch (err) {
      console.error("Failed to mark followup done", err);
    }
  };

  if (!lead) return <div className="p-8">Lead not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <DashboardLayout
        children={
          <>
            <div className="p-6 max-w-4xl mx-auto">
              <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 dark:text-blue-400"
              >
                ← Back
              </button>

              <h1 className="text-2xl font-bold mb-2">{lead.name}</h1>

              {/* Lead Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-5 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {lead.email}
                  </p>
                </div>

                <div className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-5 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {lead.phone}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 mb-4 border-gray-200 dark:border-gray-700 pb-2">
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`font-medium ${
                    activeTab === "notes"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Notes
                </button>

                <button
                  onClick={() => setActiveTab("followups")}
                  className={`font-medium ${
                    activeTab === "followups"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Followups
                </button>
              </div>

              {/* Notes Tab */}
              {activeTab === "notes" && (
                <div>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add note"
                    className="
                  w-full border-2 rounded-xl py-3 px-5
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  border-gray-200 dark:border-gray-700
                  focus:outline-none
                  focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                "
                  />

                  <button
                    onClick={handleAddNote}
                    disabled={noteLoading}
                    className={`mt-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition ${
                      noteLoading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {noteLoading ? "Adding…" : "Add Note"}
                  </button>

                  <div className="mt-4 space-y-3">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="
                      border-2 border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-800
                      py-3 px-5 rounded-xl
                    "
                      >
                        <p className=" text-gray-900 dark:text-gray-100 text-[12px]">
                          {lead.name}
                        </p>
                        {note.content}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Followups Tab */}
              {activeTab === "followups" && (
                <div>
                  <input
                    type="date"
                    value={followUpDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="
                  w-full border-2 rounded-xl py-3 px-5
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  border-gray-200 dark:border-gray-700
                  focus:outline-none
                  focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                "
                  />

                  <button
                    onClick={handleAddFollowUp}
                    disabled={followUpLoading}
                    className={`mt-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition ${
                      followUpLoading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {followUpLoading ? "Scheduling…" : "Schedule"}
                  </button>

                  <div className="mt-4 space-y-3">
                    {followups.map((f) => (
                      <div
                        key={f.id}
                        className="
                      border border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-800
                      p-3 rounded-xl flex justify-between items-center
                    "
                      >
                        <div>
                          {f.date} — {f.status}
                        </div>

                        {f.status !== "completed" && (
                          <button
                            onClick={() => handleMarkDone(f.id)}
                            className="text-green-600 dark:text-green-400"
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        }
      />
    </div>
  );
}
