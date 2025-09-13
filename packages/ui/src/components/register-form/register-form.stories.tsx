import type { Story } from "@ladle/react";
import { RegisterForm } from "./register-form";

export const Default: Story = () => (
  <RegisterForm
    onSubmit={(username, email, password) => console.log("Register:", { username, email, password })}
    onLoginClick={() => console.log("Navigate to login")}
  />
);

export const WithErrors: Story = () => (
  <RegisterForm
    onSubmit={(username, email, password) => console.log("Register:", { username, email, password })}
    onLoginClick={() => console.log("Navigate to login")}
    errors={["Username already exists", "Email is invalid", "Password is too short"]}
  />
);

export const Loading: Story = () => (
  <RegisterForm
    onSubmit={(username, email, password) => console.log("Register:", { username, email, password })}
    onLoginClick={() => console.log("Navigate to login")}
    loading={true}
  />
);

export const WithoutLoginLink: Story = () => (
  <RegisterForm
    onSubmit={(username, email, password) => console.log("Register:", { username, email, password })}
  />
);

Default.meta = {
  title: "Forms/RegisterForm",
  description: "User sign up form"
};

WithErrors.meta = {
  title: "Forms/RegisterForm/With Errors"
};

Loading.meta = {
  title: "Forms/RegisterForm/Loading State"
};

WithoutLoginLink.meta = {
  title: "Forms/RegisterForm/No Login Link"
};