export const LeadsPage = () => {
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Leads Page</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
