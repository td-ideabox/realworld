import type { Story } from "@ladle/react";
import { UserInfo } from "./user-info";

const mockUser = {
  username: "eric",
  bio: "I work at State Farm and love writing about technology and web development.",
  image: "https://api.realworld.io/images/smiley-cyrus.jpeg",
  following: false
};

const mockFollowedUser = {
  ...mockUser,
  following: true
};

const mockUserNoBio = {
  username: "jane",
  image: "https://api.realworld.io/images/demo-avatar.png"
};

const currentUser = {
  username: "eric",
  image: "https://api.realworld.io/images/smiley-cyrus.jpeg"
};

export const OtherUser: Story = () => (
  <UserInfo
    user={mockUser}
    onFollowClick={(username, following) => console.log("Follow clicked:", username, following)}
  />
);

export const FollowedUser: Story = () => (
  <UserInfo
    user={mockFollowedUser}
    onFollowClick={(username, following) => console.log("Unfollow clicked:", username, following)}
  />
);

export const OwnProfile: Story = () => (
  <UserInfo
    user={currentUser}
    currentUser={currentUser}
    onEditProfileClick={() => console.log("Edit profile clicked")}
  />
);

export const UserWithoutBio: Story = () => (
  <UserInfo
    user={mockUserNoBio}
    onFollowClick={(username, following) => console.log("Follow clicked:", username, following)}
  />
);

export const WithoutActions: Story = () => (
  <UserInfo user={mockUser} />
);

OtherUser.meta = {
  title: "User/UserInfo",
  description: "User profile information display"
};

FollowedUser.meta = {
  title: "User/UserInfo/Followed User"
};

OwnProfile.meta = {
  title: "User/UserInfo/Own Profile"
};

UserWithoutBio.meta = {
  title: "User/UserInfo/No Bio"
};

WithoutActions.meta = {
  title: "User/UserInfo/Static"
};