import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import { LeadsPage } from "./features/leads/LeadsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/leads" element={<LeadsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
