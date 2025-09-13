import type { Story } from "@ladle/react";
import { LoginForm } from "./login-form";

export const Default: Story = () => (
  <LoginForm
    onSubmit={(email, password) => console.log("Login:", { email, password })}
    onRegisterClick={() => console.log("Navigate to register")}
  />
);

export const WithErrors: Story = () => (
  <LoginForm
    onSubmit={(email, password) => console.log("Login:", { email, password })}
    onRegisterClick={() => console.log("Navigate to register")}
    errors={["Email or password is invalid", "Please try again"]}
  />
);

export const Loading: Story = () => (
  <LoginForm
    onSubmit={(email, password) => console.log("Login:", { email, password })}
    onRegisterClick={() => console.log("Navigate to register")}
    loading={true}
  />
);

export const WithoutRegisterLink: Story = () => (
  <LoginForm
    onSubmit={(email, password) => console.log("Login:", { email, password })}
  />
);

Default.meta = {
  title: "Forms/LoginForm",
  description: "User sign in form"
};

WithErrors.meta = {
  title: "Forms/LoginForm/With Errors"
};

Loading.meta = {
  title: "Forms/LoginForm/Loading State"
};

WithoutRegisterLink.meta = {
  title: "Forms/LoginForm/No Register Link"
};