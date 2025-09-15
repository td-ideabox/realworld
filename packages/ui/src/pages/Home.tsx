"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { Banner } from "../components/banner";
import { FeedToggle } from "../components/feed-toggle";
import { ArticlePreview } from "../components/article-preview";
import { TagList } from "../components/tag-list";

export function HomePage() {
  const router = useRouter();

  // For testing: Force authenticated state
  const auth = {
    isAuthenticated: true,
    user: {
      profile: {
        email: 'test@example.com',
        username: 'testuser',
      }
    }
  };

  const [activeTab, setActiveTab] = useState<"global" | "personal">("global");

  const sampleArticle = {
    slug: "how-to-build-webapps-that-scale",
    title: "How to build webapps that scale",
    description: "This is the description for the post.",
    tagList: ["react", "javascript", "webdev"],
    createdAt: "2023-01-20T00:00:00.000Z",
    favorited: false,
    favoritesCount: 29,
    author: {
      username: "eric-simons",
      image: "http://i.imgur.com/Qr71crq.jpg"
    }
  };

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

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="home-page">
      <Banner />

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <FeedToggle
              activeTab={activeTab}
              onTabChange={setActiveTab}
              showPersonalFeed={auth.isAuthenticated}
            />

            <ArticlePreview
              article={sampleArticle}
              onAuthorClick={(username) => handleNavigation(`/profile/${username}`)}
              onArticleClick={(slug) => handleNavigation(`/article/${slug}`)}
              onFavoriteClick={(slug, favorited) => {
                console.log("Favorite clicked:", slug, favorited);
              }}
              onTagClick={(tag) => {
                console.log("Tag clicked:", tag);
              }}
            />
          </div>

          <div className="col-md-3">
            <TagList
              tags={popularTags}
              onTagClick={(tag) => {
                console.log("Tag clicked:", tag);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
