import { useEffect, useState } from "react";
import "./App.css";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./LoginPage";
import ForgotPassword from "./ForgotPassword";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";
import PasswordSuccess from "./PasswordSuccess";
import Dashboard from "./Dashboard";  

function App() {
  const getPageFromHash = () => {
    const hash = window.location.hash;

    if (hash === "#login") return "login";
    if (hash === "#forgot-password") return "forgot";
    if (hash === "#verify-otp") return "verify";
    if (hash === "#reset-password") return "reset";
    if (hash === "#success") return "success";
    if (hash === "#dashboard") return "dashboard";  

    return "landing";
  };

  const [page, setPage] = useState(getPageFromHash);
  const [email, setEmail] = useState("");

  const navigate = (pageName, replace = false) => {
    const hashMap = {
      landing: "",
      login: "login",
      forgot: "forgot-password",
      verify: "verify-otp",
      reset: "reset-password",
      success: "success",
      dashboard: "dashboard",  // ← ADD THIS
    };

    const hash = `#${hashMap[pageName]}`;
    
    if (replace) {
      window.history.replaceState(null, "", hash);
    } else {
      window.history.pushState(null, "", hash);
    }
    
    setPage(pageName);

    if (pageName === "landing") {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }
  };

 useEffect(() => {
  const handleHashChange = () => {
    const hash = window.location.hash;
    const nextPage = getPageFromHash();

    setPage(nextPage);

    // Only scroll to top when returning to the landing page
    // without a section hash.
    if (nextPage === "landing" && hash === "") {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  };

  window.addEventListener("hashchange", handleHashChange);

  return () => {
    window.removeEventListener("hashchange", handleHashChange);
  };
}, []);

  return (
    <>
      {page === "landing" && (
        <LandingPage
          onLogin={() => navigate("login")}
        />
      )}

      {page === "login" && (
        <LoginPage
          onForgotPassword={() => navigate("forgot")}
        />
      )}

      {page === "forgot" && (
        <ForgotPassword
          onBack={() => navigate("login")}
          onVerify={(emailValue) => {
            setEmail(emailValue);
            navigate("verify");
          }}
        />
      )}

      {page === "verify" && (
        <VerifyOTP
          email={email}
          onBack={() => navigate("forgot")}
          onReset={() => navigate("reset")}
        />
      )}

      {page === "reset" && (
        <ResetPassword
          onSuccess={() => navigate("success", true)}
        />
      )}

      {page === "success" && (
        <PasswordSuccess
          onLogin={() => navigate("login", true)}
        />
      )}

      {page === "dashboard" && <Dashboard />}  
    </>
  );
}

export default App;