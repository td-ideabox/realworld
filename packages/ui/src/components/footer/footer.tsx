"use client";

interface FooterProps {
  onLogoClick?: () => void;
}

export const Footer = ({ onLogoClick }: FooterProps) => {
  return (
    <footer>
      <div className="container">
        <a
          href="/"
          className="logo-font"
          onClick={(e) => {
            e.preventDefault();
            onLogoClick?.();
          }}
        >
          Real World
        </a>
        <span className="attribution">
          An interactive learning project from{" "}
          <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  );
};