import React, { useEffect, useState } from "react";
import type { LeadFormData } from "../types/leadFormData";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
  initialData?: LeadFormData;
}

const defaultForm: LeadFormData = {
  name: "",
  phone: "",
  email: "",
  company: "",
  status: "New",
  source: "Website",
  assignedTo: "Admin User",
};

const LeadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState<LeadFormData>(initialData ?? defaultForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LeadFormData, string>>
  >({});

  const isEditMode = !!initialData;
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const name = e.target.name as keyof LeadFormData;
    const value = e.target.value;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: Partial<Record<keyof LeadFormData, string>> = {};
    if (!form.name.trim()) validationErrors.name = "Name is required.";

    if (!form.phone.trim()) {
      validationErrors.phone = "Phone is required.";
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      validationErrors.phone = "Phone must be 10 digits.";
    }

    // Email: optional but if present should be valid
    if (form.email && form.email.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(form.email.trim())) {
        validationErrors.email = "Enter a valid email address.";
      }
    }
    if (!form.assignedTo || !form.assignedTo.toString().trim()) {
      validationErrors.assignedTo = "Assigned To is required.";
    }

    if (!form.status) validationErrors.status = "Status is required.";
    if (!form.source) validationErrors.source = "Source is required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit(form);
  };
  useEffect(() => {
    if (!isOpen) return;

    const newForm = initialData ?? defaultForm;
    const handle = setTimeout(() => {
      setForm((prev) => {
        const keys = Object.keys(newForm) as Array<keyof LeadFormData>;
        const isSame = keys.every((k) => prev[k] === newForm[k]);
        return isSame ? prev : newForm;
      });
    }, 0);

    return () => clearTimeout(handle);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {isEditMode ? "Update Lead" : "New Lead"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Full name"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone * (10 digits)
            </label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              maxLength={10}
              placeholder="9876543210"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="optional@email.com"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company name"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.company ? "border-red-500" : ""}`}
            />
            {errors.company && (
              <p className="text-red-500 text-sm mt-1">{errors.company}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.status ? "border-red-500" : ""}`}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Source *</label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                required
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.source ? "border-red-500" : ""}`}
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Cold Call">Cold Call</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Assigned To *
            </label>
            <input
              type="text"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              required
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.assignedTo ? "border-red-500" : ""}`}
            />
            {errors.assignedTo && (
              <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl border text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              {isEditMode ? "Update Lead" : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
