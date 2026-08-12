import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userData) {
      window.location.replace("/#login");
      return;
    }

    setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/#login");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f3f4f6"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "60px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: "500px",
        width: "100%"
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}></div>
        <h1 style={{ fontSize: "28px", color: "#111827", marginBottom: "8px" }}>
          Login Successful
        </h1>
        <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "4px" }}>
          Welcome, <strong>{user.email}</strong>
        </p>
        <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "24px" }}>
          Role: {user.role}
        </p>
        <div style={{
          backgroundColor: "#ecfdf5",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "24px"
        }}>
          <p style={{ color: "#065f46", fontSize: "14px", margin: 0 }}>
            This is a test dashboard page.
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "12px 32px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;