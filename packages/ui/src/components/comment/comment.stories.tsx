import type { Story } from "@ladle/react";
import { Comment } from "./comment";

const mockComment = {
  id: 1,
  createdAt: "2016-02-18T03:22:56.637Z",
  updatedAt: "2016-02-18T03:22:56.637Z",
  body: "This is a great article! I really enjoyed reading about the different approaches to building scalable applications.",
  author: {
    username: "eric",
    bio: "I work at State Farm.",
    image: "https://api.realworld.io/images/smiley-cyrus.jpeg",
    following: false
  }
};

const mockOwnComment = {
  ...mockComment,
  id: 2,
  author: {
    username: "currentuser",
    image: "https://api.realworld.io/images/demo-avatar.png"
  }
};

const mockLongComment = {
  ...mockComment,
  id: 3,
  body: "This is a much longer comment that spans multiple lines and contains more detailed thoughts about the article. It discusses various aspects of web development, including performance optimization, user experience considerations, and the importance of maintainable code. The comment also touches on modern development practices and how they can be applied in real-world scenarios."
};

const mockShortComment = {
  ...mockComment,
  id: 4,
  body: "Great post!"
};

export const Default: Story = () => (
  <Comment
    comment={mockComment}
    onAuthorClick={(username) => console.log("Author clicked:", username)}
  />
);

export const OwnComment: Story = () => (
  <Comment
    comment={mockOwnComment}
    currentUser={{ username: "currentuser" }}
    onDeleteClick={(commentId) => console.log("Delete comment:", commentId)}
    onAuthorClick={(username) => console.log("Author clicked:", username)}
  />
);

export const LongComment: Story = () => (
  <Comment
    comment={mockLongComment}
    onAuthorClick={(username) => console.log("Author clicked:", username)}
  />
);

export const ShortComment: Story = () => (
  <Comment
    comment={mockShortComment}
    onAuthorClick={(username) => console.log("Author clicked:", username)}
  />
);

export const WithoutActions: Story = () => (
  <Comment comment={mockComment} />
);

Default.meta = {
  title: "Social/Comment",
  description: "Individual comment display"
};

OwnComment.meta = {
  title: "Social/Comment/Own Comment"
};

LongComment.meta = {
  title: "Social/Comment/Long Content"
};

ShortComment.meta = {
  title: "Social/Comment/Short Content"
};

WithoutActions.meta = {
  title: "Social/Comment/Static"
};