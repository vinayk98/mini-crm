import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getNotes } from "../../services/notePage";
import { createFollowUp, getFollowUps } from "../../services/followup";
import { getLeadById } from "../../services/leadService";

interface Lead {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  status: string;
  assignedTo: number | string;
}

interface Note {
  id: number;
  leadId: number;
  content: string;
  createdBy: number;
}

interface FollowUp {
  id: number;
  leadId: number;
  date: string;
  status: string;
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [noteLoading, setNoteLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "followups">("notes");

  const [noteText, setNoteText] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  // Fetch data
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const leadId = id;

        const [leadData, notesData, followupsData] = await Promise.all([
          getLeadById(leadId),
          getNotes(leadId),
          getFollowUps(leadId),
        ]);

        setLead(leadData);
        setNotes(notesData);
        setFollowups(followupsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  // Add Note
  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    const leadId = String(id);
    setNoteLoading(true);
    try {
      const newNote = {
        leadId,
        content: noteText.trim(),
        createdBy: 1,
      };

      const res = await fetch("http://localhost:3001/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });

      if (!res.ok) throw new Error("Failed to add note");

      const data = await res.json();

      // append optimistically
      setNotes((prev) => [...prev, data]);
      setNoteText("");

      // refresh from server to ensure consistency
      const notesData = await getNotes(leadId);
      setNotes(notesData);
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setNoteLoading(false);
    }
  };

  // Add Followup
  const handleAddFollowUp = async () => {
    if (!followUpDate) return;
    const leadId = String(id);
    setFollowUpLoading(true);
    try {
      const newFollow = {
        leadId,
        date: followUpDate,
        status: "pending",
      };

      const created = await createFollowUp(newFollow);

      // optimistic append
      setFollowups((prev) => [...prev, created]);
      setFollowUpDate("");

      // refresh from server
      const followupsData = await getFollowUps(leadId);
      setFollowups(followupsData);
    } catch (error) {
      console.error("Error adding follow-up:", error);
    } finally {
      setFollowUpLoading(false);
    }
  };

  const markDone = async (fid: number) => {
    await fetch(`http://localhost:3001/followups/${fid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });

    setFollowups(
      followups.map((f) => (f.id === fid ? { ...f, status: "completed" } : f)),
    );
  };
  if (!lead) return <div className="p-8">Lead not found</div>;
  console.log(followups, "123123");
  return (
    <div>
      <DashboardLayout
        children={
          <>
            <div className="p-6 max-w-4xl mx-auto">
              <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600"
              >
                ← Back
              </button>

              <h1 className="text-2xl font-bold mb-2">{lead.name}</h1>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border p-3 rounded">
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{lead.email}</p>
                </div>
                <div className="border p-3 rounded">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{lead.phone}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mb-4 border-b pb-2">
                <button
                  onClick={() => setActiveTab("notes")}
                  className={
                    activeTab === "notes" ? "font-bold text-blue-600" : ""
                  }
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveTab("followups")}
                  className={
                    activeTab === "followups" ? "font-bold text-blue-600" : ""
                  }
                >
                  Followups
                </button>
              </div>

              {/* Notes */}
              {activeTab === "notes" && (
                <div>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Add note"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={noteLoading}
                    className={`mt-2 bg-blue-600 text-white px-4 py-2 rounded ${noteLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {noteLoading ? "Adding…" : "Add Note"}
                  </button>

                  <div className="mt-4 space-y-2">
                    {notes.map((note) => (
                      <div key={note.id} className="border p-3 rounded">
                        {note.content}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Followups */}
              {activeTab === "followups" && (
                <div>
                  <input
                    type="date"
                    value={followUpDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <button
                    onClick={handleAddFollowUp}
                    disabled={followUpLoading}
                    className={`mt-2 bg-blue-600 text-white px-4 py-2 rounded ${followUpLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {followUpLoading ? "Scheduling…" : "Schedule"}
                  </button>

                  <div className="mt-4 space-y-2">
                    {followups.map((f) => (
                      <div
                        key={f.id}
                        className="border p-3 rounded flex justify-between"
                      >
                        <div>
                          {f.date} — {f.status}
                        </div>
                        {f.status !== "completed" && (
                          <button
                            onClick={() => markDone(f.id)}
                            className="text-green-600"
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
