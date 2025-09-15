import type { Story } from "@ladle/react";
import { TagList } from "./tag-list";

const popularTags = [
  "programming",
  "javascript",
  "emberjs",
  "angularjs",
  "react",
  "mean",
  "node",
  "rails"
];

export const PopularTags: Story = () => (
  <TagList
    tags={popularTags}
    onTagClick={(tag) => console.log("Tag clicked:", tag)}
  />
);

export const Loading: Story = () => (
  <TagList tags={[]} loading={true} />
);

export const Empty: Story = () => (
  <TagList tags={[]} />
);

export const CustomTitle: Story = () => (
  <TagList
    tags={["frontend", "backend", "devops"]}
    title="Development Tags"
    onTagClick={(tag) => console.log("Tag clicked:", tag)}
  />
);

export const FewTags: Story = () => (
  <TagList
    tags={["javascript", "typescript"]}
    onTagClick={(tag) => console.log("Tag clicked:", tag)}
  />
);

PopularTags.meta = {
  title: "Content/TagList",
  description: "Sidebar component showing popular tags"
};

Loading.meta = {
  title: "Content/TagList/Loading"
};

Empty.meta = {
  title: "Content/TagList/Empty"
};

CustomTitle.meta = {
  title: "Content/TagList/Custom Title"
};

FewTags.meta = {
  title: "Content/TagList/Few Tags"
};