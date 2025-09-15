import type { Story } from "@ladle/react";
import { SettingsForm } from "./settings-form";

const mockUser = {
  username: "johndoe",
  email: "john@example.com",
  bio: "I work at State Farm and I love writing about technology.",
  image: "https://api.realworld.io/images/smiley-cyrus.jpeg"
};

const mockUserMinimal = {
  username: "janedoe",
  email: "jane@example.com"
};

export const Default: Story = () => (
  <SettingsForm
    user={mockUser}
    onSubmit={(userData) => console.log("Settings updated:", userData)}
    onLogout={() => console.log("User logged out")}
  />
);

export const MinimalProfile: Story = () => (
  <SettingsForm
    user={mockUserMinimal}
    onSubmit={(userData) => console.log("Settings updated:", userData)}
    onLogout={() => console.log("User logged out")}
  />
);

export const WithErrors: Story = () => (
  <SettingsForm
    user={mockUser}
    onSubmit={(userData) => console.log("Settings updated:", userData)}
    onLogout={() => console.log("User logged out")}
    errors={["Username is already taken", "Email format is invalid"]}
  />
);

export const Loading: Story = () => (
  <SettingsForm
    user={mockUser}
    onSubmit={(userData) => console.log("Settings updated:", userData)}
    onLogout={() => console.log("User logged out")}
    loading={true}
  />
);

Default.meta = {
  title: "Forms/SettingsForm",
  description: "User profile settings form"
};

MinimalProfile.meta = {
  title: "Forms/SettingsForm/Minimal Profile"
};

WithErrors.meta = {
  title: "Forms/SettingsForm/With Errors"
};

Loading.meta = {
  title: "Forms/SettingsForm/Loading State"
};