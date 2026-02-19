import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getNotes } from "../../services/notePage";
import { createFollowUp, getFollowUps } from "../../services/followup";
import { getLeads } from "../../services/leadService";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  assignedTo: number;
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
  // const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"notes" | "followups">("notes");

  const [noteText, setNoteText] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  // Fetch data
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const leadId = Number(id);

        const [leads, notesData, followupsData] = await Promise.all([
          getLeads(),
          getNotes(leadId),
          getFollowUps(leadId),
        ]);

        const selectedLead = leads.find((lead: Lead) => lead.id === leadId);

        setLead(selectedLead);
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

    const newNote = {
      leadId: Number(id),
      content: noteText,
      createdBy: 1,
    };

    const res = await fetch("http://localhost:3001/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });

    const data = await res.json();
    setNotes([...notes, data]);
    setNoteText("");
  };

  // Add Followup
  const handleAddFollowUp = async () => {
    if (!followUpDate) return;

    const newFollow = {
      leadId: Number(id),
      date: followUpDate,
      status: "pending",
    };

    const res = await createFollowUp(newFollow);
    const data = await res.json();
    setFollowups([...followups, data]);
    setFollowUpDate("");
  };

  // Mark Done
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
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Add Note
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
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                  <button
                    onClick={handleAddFollowUp}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Schedule
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
