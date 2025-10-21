import type { Story } from "@ladle/react";
import { Banner } from "./banner";

export const Default: Story = () => <Banner />;

export const CustomContent: Story = () => (
  <Banner
    title="Welcome to Our Blog"
    subtitle="Discover amazing articles from our community of writers."
  />
);

export const ShortSubtitle: Story = () => (
  <Banner title="Real World" subtitle="Share knowledge." />
);

Default.meta = {
  title: "Layout/Banner",
  description: "Hero banner section for the home page"
};

CustomContent.meta = {
  title: "Layout/Banner/Custom Content"
};

ShortSubtitle.meta = {
  title: "Layout/Banner/Short Subtitle"
};