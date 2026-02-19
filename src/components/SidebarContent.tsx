interface SidebarContentProps {
  sidebarBg: string;
  sidebarBorderColor: string;
  sidebarFg: string;
  sidebarHover: string;
  sidebarActive: string;
  onNavClick: () => void;
  isActive: (to: string) => boolean;
  handleLogout?: () => void;
  crm_theme: string;
  toggleTheme: () => void;
}

function SidebarContent({
  sidebarBg,
  sidebarBorderColor,
  sidebarFg,
  sidebarHover,
  sidebarActive,
  onNavClick,
  isActive,
  handleLogout,
  crm_theme,
  toggleTheme,
}: SidebarContentProps) {
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
  };
  // theme and toggle are passed from parent

  const navLinks = [{ to: "/leads", icon: "users" as const, label: "Leads" }];
  return (
    <div className={`flex flex-col h-full ${sidebarBg}`}>
      <div
        className={`flex items-center gap-3 px-6 py-5 ${sidebarBorderColor} border-b`}
      >
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          {Icons.dashboard}
        </div>
        <span className="text-white font-semibold text-base">LeadFlow CRM</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map(({ to, icon, label }) => (
          <a
            key={to}
            href={to}
            onClick={(e) => {
              e.preventDefault();
              onNavClick();
              window.location.href = to;
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to) ? sidebarActive : `${sidebarFg} ${sidebarHover}`} hover:no-underline block`}
          >
            {Icons[icon]}
            <span>{label}</span>
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className={`px-4 py-4 ${sidebarBorderColor} border-t space-y-3`}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold uppercase tracking-wide">
              {"UN"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">{"User"}</p>
            <p className={`${sidebarFg} text-xs capitalize`}>{"admin"}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => {
              // call parent-provided toggleTheme to flip theme state
              toggleTheme?.();
            }}
            className={`flex-1 ${sidebarFg} hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 gap-2 flex items-center justify-center`}
            title="Toggle theme"
          >
            {crm_theme === "dark" ? Icons.sun : Icons.moon}
            <span>{crm_theme === "dark" ? "Light" : "Dark"}</span>
          </button>

          <button
            onClick={handleLogout}
            className={`flex-1 ${sidebarFg} hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 gap-2 flex items-center justify-center`}
            title="Logout"
          >
            {Icons.logout}
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SidebarContent;
