import type { Story } from "@ladle/react";
import { ArticleHeader } from "./article-header";

const mockArticle = {
  slug: "how-to-build-webapps-that-scale",
  title: "How to Build Webapps That Scale",
  description: "This is the description for the post.",
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
  favoritesCount: 30,
  author: {
    ...mockArticle.author,
    following: true
  }
};

const mockOwnArticle = {
  ...mockArticle,
  author: {
    username: "currentuser",
    image: "https://api.realworld.io/images/demo-avatar.png"
  }
};

export const OtherUserArticle: Story = () => (
  <ArticleHeader
    article={mockArticle}
    onFollowClick={(username, following) => console.log("Follow clicked:", username, following)}
    onFavoriteClick={(slug, favorited) => console.log("Favorite clicked:", slug, favorited)}
    onAuthorClick={(username) => console.log("Author clicked:", username)}
  />
);

export const FavoritedAndFollowing: Story = () => (
  <ArticleHeader
    article={mockFavoritedArticle}
    onFollowClick={(username, following) => console.log("Follow clicked:", username, following)}
    onFavoriteClick={(slug, favorited) => console.log("Favorite clicked:", slug, favorited)}
    onAuthorClick={(username) => console.log("Author clicked:", username)}
  />
);

export const OwnArticle: Story = () => (
  <ArticleHeader
    article={mockOwnArticle}
    currentUser={{ username: "currentuser" }}
    onEditClick={(slug) => console.log("Edit clicked:", slug)}
    onDeleteClick={(slug) => console.log("Delete clicked:", slug)}
    onAuthorClick={(username) => console.log("Author clicked:", username)}
  />
);

OtherUserArticle.meta = {
  title: "Article/ArticleHeader",
  description: "Header section for article pages"
};

FavoritedAndFollowing.meta = {
  title: "Article/ArticleHeader/Favorited & Following"
};

OwnArticle.meta = {
  title: "Article/ArticleHeader/Own Article"
};