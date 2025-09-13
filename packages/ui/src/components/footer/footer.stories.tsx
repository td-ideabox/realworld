import type { Story } from "@ladle/react";
import { Footer } from "./footer";

export const Default: Story = () => (
  <Footer onLogoClick={() => console.log("Logo clicked")} />
);

export const WithoutClick: Story = () => <Footer />;

Default.meta = {
  title: "Layout/Footer",
  description: "Application footer with logo and attribution"
};

WithoutClick.meta = {
  title: "Layout/Footer/No Interaction"
};