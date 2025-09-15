import type { Story } from "@ladle/react";
import { CommentForm } from "./comment-form";

const mockUser = {
  username: "johndoe",
  image: "https://api.realworld.io/images/smiley-cyrus.jpeg"
};

export const AuthenticatedUser: Story = () => (
  <CommentForm
    user={mockUser}
    onSubmit={(body) => console.log("Comment submitted:", body)}
  />
);

export const UnauthenticatedUser: Story = () => (
  <CommentForm
    onSubmit={(body) => console.log("Comment submitted:", body)}
    onLoginClick={() => console.log("Navigate to login")}
  />
);

export const WithErrors: Story = () => (
  <CommentForm
    user={mockUser}
    onSubmit={(body) => console.log("Comment submitted:", body)}
    errors={["Comment cannot be empty", "Please try again"]}
  />
);

export const Loading: Story = () => (
  <CommentForm
    user={mockUser}
    onSubmit={(body) => console.log("Comment submitted:", body)}
    loading={true}
  />
);

export const UserWithoutImage: Story = () => (
  <CommentForm
    user={{ username: "janedoe" }}
    onSubmit={(body) => console.log("Comment submitted:", body)}
  />
);

AuthenticatedUser.meta = {
  title: "Social/CommentForm",
  description: "Form for adding new comments"
};

UnauthenticatedUser.meta = {
  title: "Social/CommentForm/Unauthenticated"
};

WithErrors.meta = {
  title: "Social/CommentForm/With Errors"
};

Loading.meta = {
  title: "Social/CommentForm/Loading State"
};

UserWithoutImage.meta = {
  title: "Social/CommentForm/No Avatar"
};