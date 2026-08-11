import { useEffect, useState } from "react";
import "./App.css";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./LoginPage";
import ForgotPassword from "./ForgotPassword";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";
import PasswordSuccess from "./PasswordSuccess";

function App() {
  const getPageFromHash = () => {
    const hash = window.location.hash;

    if (hash === "#login") return "login";
    if (hash === "#forgot-password") return "forgot";
    if (hash === "#verify-otp") return "verify";
    if (hash === "#reset-password") return "reset";
    if (hash === "#success") return "success";

    return "landing";
  };

  const [page, setPage] = useState(getPageFromHash);
  const [email, setEmail] = useState("");

  const navigate = (pageName) => {
    const hashMap = {
      landing: "",
      login: "login",
      forgot: "forgot-password",
      verify: "verify-otp",
      reset: "reset-password",
      success: "success",
    };

    window.location.hash = hashMap[pageName];

    setPage(pageName);
  };

  useEffect(() => {
    const handleHashChange = () => {
      setPage(getPageFromHash());
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
          onSuccess={() => navigate("success")}
        />
      )}

      {page === "success" && (
        <PasswordSuccess
          onLogin={() => navigate("login")}
        />
      )}
    </>
  );
}

export default App;