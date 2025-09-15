"use client";

interface Author {
  username: string;
  bio?: string;
  image?: string;
  following?: boolean;
}

interface Article {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Author;
}

interface ArticleHeaderProps {
  article: Article;
  currentUser?: { username: string } | null;
  onFollowClick?: (username: string, following: boolean) => void;
  onFavoriteClick?: (slug: string, favorited: boolean) => void;
  onEditClick?: (slug: string) => void;
  onDeleteClick?: (slug: string) => void;
  onAuthorClick?: (username: string) => void;
}

export const ArticleHeader = ({
  article,
  currentUser,
  onFollowClick,
  onFavoriteClick,
  onEditClick,
  onDeleteClick,
  onAuthorClick
}: ArticleHeaderProps) => {
  const isOwnArticle = currentUser?.username === article.author.username;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="banner">
      <div className="container">
        <h1>{article.title}</h1>

        <div className="article-meta">
          <a
            href={`/profile/${article.author.username}`}
            onClick={(e) => {
              e.preventDefault();
              onAuthorClick?.(article.author.username);
            }}
          >
            <img src={article.author.image} alt={article.author.username} />
          </a>
          <div className="info">
            <a
              href={`/profile/${article.author.username}`}
              className="author"
              onClick={(e) => {
                e.preventDefault();
                onAuthorClick?.(article.author.username);
              }}
            >
              {article.author.username}
            </a>
            <span className="date">{formatDate(article.createdAt)}</span>
          </div>
          {isOwnArticle ? (
            <>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => onEditClick?.(article.slug)}
              >
                <i className="ion-edit"></i> Edit Article
              </button>
              &nbsp;&nbsp;
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDeleteClick?.(article.slug)}
              >
                <i className="ion-trash-a"></i> Delete Article
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn btn-sm ${
                  article.author.following ? "btn-secondary" : "btn-outline-secondary"
                }`}
                onClick={() => onFollowClick?.(article.author.username, article.author.following || false)}
              >
                <i className="ion-plus-round"></i>
                &nbsp; {article.author.following ? "Unfollow" : "Follow"} {article.author.username}
              </button>
              &nbsp;&nbsp;
              <button
                className={`btn btn-sm ${
                  article.favorited ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => onFavoriteClick?.(article.slug, article.favorited)}
              >
                <i className="ion-heart"></i>
                &nbsp; {article.favorited ? "Unfavorite" : "Favorite"} Article{" "}
                <span className="counter">({article.favoritesCount})</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};