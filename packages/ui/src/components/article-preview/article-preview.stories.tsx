import type { Story } from "@ladle/react";
import { ArticlePreview } from "./article-preview";

const mockArticle = {
  slug: "how-to-build-webapps-that-scale",
  title: "How to Build Webapps That Scale",
  description: "This is the description for the post. It's a great post about scaling web applications.",
  tagList: ["reactjs", "angularjs", "dragons"],
  createdAt: "2016-02-18T03:22:56.637Z",
  favorited: false,
  favoritesCount: 29,
  author: {
    username: "eric",
    bio: "I work at statefarm.",
    image: "https://api.realworld.io/images/smiley-cyrus.jpeg",
    following: false
  }
};

const mockFavoritedArticle = {
  ...mockArticle,
  favorited: true,
  favoritesCount: 30
};

const mockArticleWithManyTags = {
  ...mockArticle,
  tagList: ["reactjs", "angularjs", "vue", "javascript", "typescript", "frontend", "webdev"]
};

export const Default: Story = () => (
  <ArticlePreview
    article={mockArticle}
    onAuthorClick={(username) => console.log("Author clicked:", username)}
    onArticleClick={(slug) => console.log("Article clicked:", slug)}
    onFavoriteClick={(slug, favorited) => console.log("Favorite clicked:", slug, favorited)}
    onTagClick={(tag) => console.log("Tag clicked:", tag)}
  />
);

export const Favorited: Story = () => (
  <ArticlePreview
    article={mockFavoritedArticle}
    onAuthorClick={(username) => console.log("Author clicked:", username)}
    onArticleClick={(slug) => console.log("Article clicked:", slug)}
    onFavoriteClick={(slug, favorited) => console.log("Favorite clicked:", slug, favorited)}
    onTagClick={(tag) => console.log("Tag clicked:", tag)}
  />
);

export const ManyTags: Story = () => (
  <ArticlePreview
    article={mockArticleWithManyTags}
    onAuthorClick={(username) => console.log("Author clicked:", username)}
    onArticleClick={(slug) => console.log("Article clicked:", slug)}
    onFavoriteClick={(slug, favorited) => console.log("Favorite clicked:", slug, favorited)}
    onTagClick={(tag) => console.log("Tag clicked:", tag)}
  />
);

export const WithoutCallbacks: Story = () => (
  <ArticlePreview article={mockArticle} />
);

Default.meta = {
  title: "Article/ArticlePreview",
  description: "Preview card for articles in feed"
};

Favorited.meta = {
  title: "Article/ArticlePreview/Favorited"
};

ManyTags.meta = {
  title: "Article/ArticlePreview/Many Tags"
};

WithoutCallbacks.meta = {
  title: "Article/ArticlePreview/Static"
};