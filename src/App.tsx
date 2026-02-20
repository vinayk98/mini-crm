import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import NotFoundPage from "./components/NotFoundPage";

const LoginPage = lazy(() => import("./features/auth/LoginPage"));
const LeadsPage = lazy(() => import("./features/leads/LeadsPage"));
const LeadDetailPage = lazy(() => import("./features/leads/LeadDetailPage"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        }
      >
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/leads"
            element={
              <ProtectedRoute allowedRoles={["admin", "sales", "manager"]}>
                <LeadsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "sales", "manager"]}>
                <LeadDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
