import type { Story } from "@ladle/react";
import { Head } from "./head";

export const Default: Story = () => <Head />;

export const CustomTitle: Story = () => (
  <Head title="Custom Article Title" description="This is a custom article description" />
);

export const WithChildren: Story = () => (
  <Head title="With Additional Meta">
    <meta name="author" content="John Doe" />
    <meta name="keywords" content="react,typescript,conduit" />
  </Head>
);

Default.meta = {
  title: "Layout/Head",
  description: "HTML head component for metadata management"
};

CustomTitle.meta = {
  title: "Layout/Head/Custom Title"
};

WithChildren.meta = {
  title: "Layout/Head/With Children"
};