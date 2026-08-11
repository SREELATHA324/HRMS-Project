import { useState } from "react";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./LoginPage";
import ForgotPassword from "./ForgotPassword";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";
import PasswordSuccess from "./PasswordSuccess";

function App() {
  const [page, setPage] = useState("landing");
  const [email, setEmail] = useState("");

  return (
    <>
      {page === "landing" && (
        <LandingPage
          onLogin={() => setPage("login")}
        />
      )}

      {page === "login" && (
        <LoginPage
          onForgotPassword={() => setPage("forgot")}
        />
      )}

      {page === "forgot" && (
        <ForgotPassword
          onBack={() => setPage("login")}
          onVerify={(emailValue) => {
            setEmail(emailValue);
            setPage("verify");
          }}
        />
      )}

      {page === "verify" && (
        <VerifyOTP
          email={email}
          onBack={() => setPage("forgot")}
          onReset={() => setPage("reset")}
        />
      )}

      {page === "reset" && (
        <ResetPassword
          onSuccess={() => setPage("success")}
        />
      )}

      {page === "success" && (
        <PasswordSuccess
          onLogin={() => setPage("login")}
        />
      )}
    </>
  );
}

export default App;