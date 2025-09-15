"use client";

interface FeedToggleProps {
  activeTab: "global" | "personal";
  onTabChange: (tab: "global" | "personal") => void;
  showPersonalFeed?: boolean;
  user?: { username: string } | null;
}

export const FeedToggle = ({
  activeTab,
  onTabChange,
  showPersonalFeed = false,
  user
}: FeedToggleProps) => {
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {showPersonalFeed && user && (
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "personal" ? "active" : ""}`}
              href=""
              onClick={(e) => {
                e.preventDefault();
                onTabChange("personal");
              }}
            >
              Your Feed
            </a>
          </li>
        )}
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "global" ? "active" : ""}`}
            href=""
            onClick={(e) => {
              e.preventDefault();
              onTabChange("global");
            }}
          >
            Global Feed
          </a>
        </li>
      </ul>
    </div>
  );
};