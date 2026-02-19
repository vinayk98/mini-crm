import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "../../components/StatusBadge";
import DashboardLayout from "../../components/DashboardLayout";
import type { Lead } from "../../types/lead";
import { BsEyeFill, BsPencilSquare, BsTrash3Fill } from "react-icons/bs";

const PAGE_SIZE = 10;
export default function LeadsListPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Leads from API
  useEffect(() => {
    fetch("http://localhost:3001/leads")
      .then((res) => res.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ✅ Filtering + Sorting
  const filtered = useMemo(() => {
    let result = [...leads];

    if (statusFilter !== "All") {
      result = result.filter((l) => l.status === statusFilter?.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) => l.name.toLowerCase().includes(q) || l.phone.includes(q),
      );
    }

    result.sort((a, b) => {
      const diff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "asc" ? diff : -diff;
    });

    return result;
  }, [leads, search, statusFilter, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return <div className="p-6">Loading leads...</div>;
  }
  console.log(leads);
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

                <button
                  onClick={() => navigate("/leads/new")}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  + New Lead
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <input
                  type="text"
                  placeholder="Search name or phone..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="border px-3 py-2 rounded-lg w-full sm:w-64"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="border px-3 py-2 rounded-lg w-full sm:w-48"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Lost">Lost</option>
                </select>

                <button
                  onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
                  className="border px-4 py-2 rounded-lg w-full sm:w-auto"
                >
                  Date {sortDir === "asc" ? "↑" : "↓"}
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto border rounded-xl">
                <table className="w-full text-sm">
                  <thead className="border-b hover:bg-gray-lighter dark:hover:bg-gray-100 transition">
                    <tr>
                      <th className="p-3 text-left text-white dark:text-gray-600">
                        Name
                      </th>
                      <th className="p-3 text-left text-white dark:text-gray-600">
                        Phone
                      </th>
                      <th className="p-3 text-left text-white dark:text-gray-600">
                        Source
                      </th>
                      <th className="p-3 text-left text-white dark:text-gray-600">
                        Status
                      </th>
                      <th className="p-3 text-left text-white dark:text-gray-600">
                        Created
                      </th>
                      <th className="p-3 text-right text-white dark:text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b hover:bg-gray-lighter dark:hover:hover:bg-gray-100 transition"
                      >
                        <td className="px-4 py-3 font-medium">
                          <div className="flex flex-col text-white dark:text-gray-600">
                            <span>{lead.name}</span>
                            <span className="text-[12px]">{lead.company}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-white dark:text-gray-600">
                          {lead.phone}
                        </td>
                        <td className="px-4 py-3 text-white dark:text-gray-600">
                          {lead.source}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-4 py-3 text-white dark:text-gray-600">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end items-center gap-4">
                            <button
                              onClick={() => navigate(`/leads/${lead.id}`)}
                              className="text-blue-600 hover:text-blue-800 transition"
                              title="View"
                            >
                              <BsEyeFill size={18} />
                            </button>
                            <button
                              onClick={() => navigate(`/leads/edit/${lead.id}`)}
                              className="text-green-600 hover:text-green-800 transition"
                              title="Edit"
                            >
                              <BsPencilSquare size={18} />
                            </button>
                            <button
                              onClick={async () => {
                                await fetch(
                                  `http://localhost:3001/leads/${lead.id}`,
                                  {
                                    method: "DELETE",
                                  },
                                );
                                setLeads((prev) =>
                                  prev.filter((l) => l.id !== lead.id),
                                );
                              }}
                              className="text-red-600 hover:text-red-800 transition"
                              title="Delete"
                            >
                              <BsTrash3Fill size={18} />
                            </button>
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
                      <h2 className="font-semibold">{lead.name}</h2>
                      <StatusBadge status={lead.status} />
                    </div>

                    <p className="text-sm text-gray-600">{lead.phone}</p>
                    <p className="text-sm text-gray-500">{lead.source}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex justify-between mt-3 text-sm">
                      <button
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        className="text-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/leads/edit/${lead.id}`)}
                        className="text-green-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          await fetch(
                            `http://localhost:3001/leads/${lead.id}`,
                            {
                              method: "DELETE",
                            },
                          );
                          setLeads((prev) =>
                            prev.filter((l) => l.id !== lead.id),
                          );
                        }}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
                  <p className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border rounded disabled:opacity-40"
                    >
                      Prev
                    </button>

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-4 py-2 border rounded disabled:opacity-40"
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
    </div>
  );
}
