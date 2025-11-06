"use client";

interface BannerProps {
  title?: string;
  subtitle?: string;
}

export const Banner = ({
  title = "Real World",
  subtitle = "A place to share your knowledge."
}: BannerProps) => {
  return (
    <div className="banner">
      <div className="container">
        <h1 className="logo-font">{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};