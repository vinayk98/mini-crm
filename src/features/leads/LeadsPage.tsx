import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "../../components/StatusBadge";
import DashboardLayout from "../../components/DashboardLayout";
import type { Lead as StoreLead } from "../../store/leadStore";
import { useLeadStore } from "../../store/leadStore";
import { BsEyeFill, BsPencilSquare, BsTrash3Fill } from "react-icons/bs";
import LeadModal from "../../components/LeadFormData";
import type { LeadFormData } from "../../types/leadFormData";
import CustomSelect from "../../components/CustomSelect";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "All" },
  { label: "New", value: "New" },
  { label: "Contacted", value: "Contacted" },
  { label: "Qualified", value: "Qualified" },
  { label: "Lost", value: "Lost" },
];
export default function LeadsListPage() {
  const navigate = useNavigate();
  const leads = useLeadStore((s) => s.leads);
  const role = useMemo(() => localStorage.getItem("role"), []);
  const fetchLeads = useLeadStore((s) => s.fetchLeads);
  const addLead = useLeadStore((s) => s.addLead);
  const updateLead = useLeadStore((s) => s.updateLead);
  const deleteLead = useLeadStore((s) => s.deleteLead);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<StoreLead | null>(null);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const loading = useLeadStore((s) => s.loading);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // debounce query -> search (300ms)
  useEffect(() => {
    const t = setTimeout(() => setSearch(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleOpenNew = useCallback(() => {
    setSelectedLead(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((lead: StoreLead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  }, []);

  const handleView = useCallback(
    (id: string) => {
      navigate(`/leads/${id}`);
    },
    [navigate],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteLead(id);
    },
    [deleteLead],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setPage(1);
    },
    [],
  );

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handleSortToggle = useCallback(() => {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }, []);

  const filtered = useMemo(() => {
    let result = [...leads];

    if (statusFilter !== "All") {
      const sf = statusFilter.toLowerCase();
      result = result.filter((l) => l.status?.toLowerCase() === sf);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) => l.name?.toLowerCase().includes(q) || l.phone?.includes(q),
      );
    }

    result.sort((a, b) => {
      const diff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "asc" ? diff : -diff;
    });

    return result;
  }, [leads, search, statusFilter, sortDir]);

  const handleSaveLead = async (formData: LeadFormData) => {
    try {
      if (selectedLead) {
        // update existing lead
        const payload: Partial<StoreLead> = {
          ...selectedLead,
          ...formData,
          assignedTo:
            Number(formData.assignedTo) || selectedLead.assignedTo || 1,
        };
        await updateLead(selectedLead.id, payload);
      } else {
        // CREATE
        const payload: Omit<StoreLead, "id"> = {
          ...formData,
          createdAt: new Date().toISOString(),
          assignedTo: Number(formData.assignedTo) || 1,
        } as Omit<StoreLead, "id">;
        await addLead(payload);
      }
    } catch (err) {
      console.error("Failed to save lead", err);
    } finally {
      setModalOpen(false);
      setSelectedLead(null);
    }
  };

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    [filtered],
  );

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  if (loading) return <div className="p-6">Loading leads...</div>;

  return (
    <div>
      <DashboardLayout
        children={
          <>
            <div className="p-4 sm:p-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-600 dark:text-white">
                  Leads
                </h1>

                {role === "admin" ? (
                  <button
                    onClick={handleOpenNew}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    + New Lead
                  </button>
                ) : null}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <input
                  type="text"
                  placeholder="Search name or phone..."
                  value={query}
                  onChange={handleSearchChange}
                  className="rounded-xl px-4 h-[52px] flex items-center justify-between cursor-pointer
        border bg-white text-gray-800
        dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700"
                />
                <CustomSelect
                  value={statusFilter}
                  className="w-full sm:w-48"
                  options={STATUS_OPTIONS}
                  onChange={handleStatusChange}
                />

                <button
                  onClick={handleSortToggle}
                  className="rounded-xl px-4 h-[52px] flex items-center justify-between cursor-pointer border bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700"
                >
                  Date {sortDir === "asc" ? "↑" : "↓"}
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto border rounded-xl">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="p-3 text-left dark:text-white text-black">
                        Name
                      </th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                        Phone
                      </th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                        Source
                      </th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="p-3 text-left text-gray-700 dark:text-gray-300">
                        Created
                      </th>
                      <th className="p-3 text-right text-gray-700 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <td className="px-4 py-3 font-medium">
                          <div className="flex flex-col text-gray-700 dark:text-gray-300">
                            <span>{lead.name}</span>
                            <span className="text-[12px]">{lead.company}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {lead.phone}
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {lead.source}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end items-center gap-4">
                            <button
                              onClick={() => handleView(lead.id)}
                              className="text-blue-600 hover:text-blue-800 transition"
                              title="View"
                            >
                              <BsEyeFill size={18} />
                            </button>
                            {role === "admin" ? (
                              <>
                                <button
                                  onClick={() => handleEdit(lead)}
                                  className="text-green-600 hover:text-green-800 transition"
                                  title="Edit"
                                >
                                  <BsPencilSquare size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(lead.id)}
                                  className="text-red-600 hover:text-red-800 transition"
                                  title="Delete"
                                >
                                  <BsTrash3Fill size={18} />
                                </button>
                              </>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-4">
                {paginated.map((lead) => (
                  <div
                    key={lead.id}
                    className="border rounded-xl p-4 shadow-sm bg-white dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="font-semibold text-gray-700 dark:text-gray-300">
                        {lead.name}
                      </h2>
                      <StatusBadge status={lead.status} />
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {lead.phone}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {lead.source}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex justify-between mt-3 text-sm">
                      <button
                        onClick={() => handleView(lead.id)}
                        className="text-blue-600"
                      >
                        View
                      </button>
                      {role === "admin" ? (
                        <>
                          <button
                            onClick={() => handleEdit(lead)}
                            className="text-green-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="text-red-600"
                          >
                            Delete
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Page {page} of {totalPages}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border rounded disabled:opacity-40 text-gray-700 dark:text-gray-300"
                    >
                      Prev
                    </button>

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-4 py-2 border rounded disabled:opacity-40 text-gray-700 dark:text-gray-300"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        }
      />
      <LeadModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedLead(null);
        }}
        onSubmit={handleSaveLead}
        initialData={
          selectedLead
            ? {
                name: selectedLead.name,
                phone: selectedLead.phone,
                email: selectedLead.email,
                company: selectedLead.company,
                status: selectedLead.status,
                source: selectedLead.source,
                assignedTo: String(selectedLead.assignedTo ?? ""),
              }
            : undefined
        }
      />
    </div>
  );
}
