import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SidebarContent from "./SidebarContent";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(
    () => localStorage.getItem("crm_theme") === "dark",
  );
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("crm_theme", dark ? "dark" : "light");
  }, [dark]);

  // check used for dark and light mode
  const crm_theme = dark ? "dark" : "light";

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("crm_theme");
  };
  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to + "/");
  const sidebarBg =
    crm_theme === "dark"
      ? "bg-gradient-to-b from-gray-900 to-gray-800"
      : "bg-gradient-to-b from-gray-800 to-gray-700";
  const sidebarBorderColor =
    crm_theme === "dark" ? "border-gray-700" : "border-indigo-500/30";
  const sidebarFg = crm_theme === "dark" ? "text-gray-300" : "text-white/90";
  const sidebarHover =
    crm_theme === "dark"
      ? "hover:text-white hover:bg-gray-700/50"
      : "hover:text-white hover:bg-white/20";
  const sidebarActive =
    crm_theme === "dark"
      ? "text-white bg-gray-700/50 border border-gray-500/30"
      : "text-white bg-white/20 border border-white/30";

  const toggleTheme = () => setDark((d) => !d);
  const Icons = {
    dashboard: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h7"
        />
      </svg>
    ),
    users: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    sun: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    moon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
    logout: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    ),
    menu: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    ),
  };
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <aside className={`hidden lg:flex flex-col w-64 shrink-0 ${sidebarBg}`}>
        <SidebarContent
          sidebarBg={sidebarBg}
          sidebarBorderColor={sidebarBorderColor}
          sidebarFg={sidebarFg}
          sidebarHover={sidebarHover}
          sidebarActive={sidebarActive}
          onNavClick={() => setSidebarOpen(false)}
          crm_theme={crm_theme}
          toggleTheme={toggleTheme}
          isActive={isActive}
          handleLogout={handleLogout}
          role={role}
          email={email}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className={`absolute left-0 top-0 h-full w-64 ${sidebarBg} flex flex-col z-50 shadow-2xl`}
          >
            <SidebarContent
              sidebarBg={sidebarBg}
              sidebarBorderColor={sidebarBorderColor}
              sidebarFg={sidebarFg}
              sidebarHover={sidebarHover}
              sidebarActive={sidebarActive}
              onNavClick={() => setSidebarOpen(false)}
              crm_theme={crm_theme}
              toggleTheme={toggleTheme}
              isActive={isActive}
              handleLogout={handleLogout}
              role={role}
              email={email}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
            aria-label="Open menu"
          >
            {Icons.menu}
          </button>
          <span className="font-semibold text-lg text-gray-700 dark:text-gray-300">
            LeadFlow CRM
          </span>
        </header>

        <main
          className={`flex-1 overflow-auto p-1 ${crm_theme === "dark" ? "bg-gray-800" : "bg-white"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
