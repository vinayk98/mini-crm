import React, { useEffect, useState } from "react";
import type { LeadFormData } from "../types/leadFormData";
import CustomSelect from "./CustomSelect";
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
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-8 py-6 relative max-h-[85vh] animate-slideUp transition-colors">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {isEditMode ? "Update Lead" : "New Lead"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-xl transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              className={`w-full rounded-xl px-4 py-3 border
              bg-white text-gray-800 border-gray-300
              dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${errors.name ? "border-red-500 dark:border-red-400" : ""}
            `}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company name"
              className="w-full rounded-xl px-4 py-3 border
              bg-white text-gray-800 border-gray-300
              dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Phone *
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                placeholder="9876543210"
                className={`w-full rounded-xl px-4 py-3 border
                bg-white text-gray-800 border-gray-300
                dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${errors.phone ? "border-red-500 dark:border-red-400" : ""}
              `}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="optional@email.com"
                className={`w-full rounded-xl px-4 py-3 border
                bg-white text-gray-800 border-gray-300
                dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${errors.email ? "border-red-500 dark:border-red-400" : ""}
              `}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Status + Source */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Status *
              </label>
              <CustomSelect
                value={form.status}
                options={[
                  { label: "New", value: "New" },
                  { label: "Contacted", value: "Contacted" },
                  { label: "Qualified", value: "Qualified" },
                  { label: "Lost", value: "Lost" },
                ]}
                onChange={(val) => setForm({ ...form, status: val })}
                error={errors.status}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Source *
              </label>
              <CustomSelect
                value={form.source}
                options={[
                  { label: "Website", value: "Website" },
                  { label: "Referral", value: "Referral" },
                  { label: "Social Media", value: "Social Media" },
                  { label: "Cold Call", value: "Cold Call" },
                ]}
                onChange={(val) => setForm({ ...form, source: val })}
                error={errors.source}
              />
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Assigned To *
            </label>
            <input
              type="text"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              className={`w-full rounded-xl px-4 py-3 border
              bg-white text-gray-800 border-gray-300
              dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${errors.assignedTo ? "border-red-500 dark:border-red-400" : ""}
            `}
            />
            {errors.assignedTo && (
              <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl border
              border-gray-300 text-gray-700
              hover:bg-gray-100
              dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700
              transition"
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
