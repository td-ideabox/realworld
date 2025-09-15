import type { Story } from "@ladle/react";
import { FeedToggle } from "./feed-toggle";
import { useState } from "react";

const mockUser = { username: "johndoe" };

export const GlobalFeedOnly: Story = () => {
  const [activeTab, setActiveTab] = useState<"global" | "personal">("global");

  return (
    <FeedToggle
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

export const WithPersonalFeed: Story = () => {
  const [activeTab, setActiveTab] = useState<"global" | "personal">("global");

  return (
    <FeedToggle
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showPersonalFeed={true}
      user={mockUser}
    />
  );
};

export const PersonalFeedActive: Story = () => {
  const [activeTab, setActiveTab] = useState<"global" | "personal">("personal");

  return (
    <FeedToggle
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showPersonalFeed={true}
      user={mockUser}
    />
  );
};

GlobalFeedOnly.meta = {
  title: "Feed/FeedToggle",
  description: "Toggle between Global and Personal feeds"
};

WithPersonalFeed.meta = {
  title: "Feed/FeedToggle/With Personal"
};

PersonalFeedActive.meta = {
  title: "Feed/FeedToggle/Personal Active"
};