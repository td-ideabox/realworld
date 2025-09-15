"use client";

import { useRouter } from "next/navigation";
import { RegisterForm } from "../components/register-form";

export function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (username: string, email: string, password: string) => {
    console.log("Register attempt:", { username, email, password });
    // TODO: Integrate with actual authentication logic
    // For now, just simulate a successful registration
    router.push("/");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <RegisterForm
      onSubmit={handleRegister}
      onLoginClick={handleLoginClick}
    />
  );
}
