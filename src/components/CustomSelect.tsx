import React, { useState, useRef, useEffect } from "react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  variant?: "modal" | "filter";
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  error,
  variant = "modal",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  const baseStyle =
    variant === "modal"
      ? `
        w-full rounded-xl px-4 h-[52px] flex items-center justify-between cursor-pointer
        border bg-white text-gray-800
        dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700
        ${error ? "border-red-500 dark:border-red-400" : "border-gray-300"}
      `
      : `
        border rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer
        bg-white text-gray-700 border-gray-300
        dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700
      `;

  const dropdownStyle = variant === "modal" ? "rounded-xl" : "rounded-lg";

  return (
    <div className={`relative ${className}`} ref={ref}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className={`${baseStyle} transition-colors`}
      >
        <span className="truncate">{selected?.label}</span>
        <span className="text-gray-500 dark:text-gray-400 text-sm">▾</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className={`
            absolute top-full left-0 mt-1 w-full
            bg-white border border-gray-200 shadow-lg z-50 overflow-hidden
            dark:bg-gray-800 dark:border-gray-700
            origin-top animate-dropdown
            ${dropdownStyle}
          `}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`
                  px-4 py-3 cursor-pointer transition-colors
                  ${
                    isSelected
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
