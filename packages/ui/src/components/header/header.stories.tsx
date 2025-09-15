import type { Story } from "@ladle/react";
import { Header } from "./header";

const mockUser = {
  username: "johndoe",
  image: "https://api.realworld.io/images/smiley-cyrus.jpeg"
};

export const Unauthenticated: Story = () => (
  <Header
    onHomeClick={() => console.log("Home clicked")}
    onLoginClick={() => console.log("Login clicked")}
    onRegisterClick={() => console.log("Register clicked")}
  />
);

export const Authenticated: Story = () => (
  <Header
    user={mockUser}
    onHomeClick={() => console.log("Home clicked")}
    onNewArticleClick={() => console.log("New Article clicked")}
    onSettingsClick={() => console.log("Settings clicked")}
    onProfileClick={() => console.log("Profile clicked")}
  />
);

export const AuthenticatedWithoutImage: Story = () => (
  <Header
    user={{ username: "janedoe" }}
    onHomeClick={() => console.log("Home clicked")}
    onNewArticleClick={() => console.log("New Article clicked")}
    onSettingsClick={() => console.log("Settings clicked")}
    onProfileClick={() => console.log("Profile clicked")}
  />
);

Unauthenticated.meta = {
  title: "Layout/Header",
  description: "Navigation header for unauthenticated users"
};

Authenticated.meta = {
  title: "Layout/Header/Authenticated"
};

AuthenticatedWithoutImage.meta = {
  title: "Layout/Header/No Avatar"
};