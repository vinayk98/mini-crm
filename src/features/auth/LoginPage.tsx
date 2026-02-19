import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = localStorage.getItem("user");

  if (user) return <Navigate to="/leads" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    // Demo credentials
    if (
      (email === "admin@crm.com" && password === "admin123") ||
      (email === "user@crm.com" && password === "user123")
    ) {
      localStorage.setItem("user", email);
      navigate("/leads");
    } else {
      setError("Invalid email or password.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-slate-900 p-10 text-white">
        <div>
          <h2 className="text-2xl font-bold">LeadFlow CRM</h2>
        </div>

        <div>
          <p className="text-slate-300 mb-6">
            Streamline your sales pipeline and close more deals efficiently.
          </p>

          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-xs text-slate-400">Admin Demo</p>
              <p className="text-sm font-mono">admin@crm.com / admin123</p>
            </div>

            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-xs text-slate-400">User Demo</p>
              <p className="text-sm font-mono">user@crm.com / user123</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500">© 2026 LeadFlow CRM</p>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full border rounded-md px-3 py-2 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-100 p-2 rounded">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
