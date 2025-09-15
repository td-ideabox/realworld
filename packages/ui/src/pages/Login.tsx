"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "../components/login-form";

export function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    console.log("Login attempt:", { email, password });
    // TODO: Integrate with actual authentication logic
    // For now, just simulate a successful login
    router.push("/");
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      onRegisterClick={handleRegisterClick}
    />
  );
}
