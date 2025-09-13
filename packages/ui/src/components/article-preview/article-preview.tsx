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
  body?: string;
  tagList: string[];
  createdAt: string;
  updatedAt?: string;
  favorited: boolean;
  favoritesCount: number;
  author: Author;
}

interface ArticlePreviewProps {
  article: Article;
  onAuthorClick?: (username: string) => void;
  onArticleClick?: (slug: string) => void;
  onFavoriteClick?: (slug: string, favorited: boolean) => void;
  onTagClick?: (tag: string) => void;
}

export const ArticlePreview = ({
  article,
  onAuthorClick,
  onArticleClick,
  onFavoriteClick,
  onTagClick
}: ArticlePreviewProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="article-preview">
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
        <button
          className={`btn btn-outline-primary btn-sm pull-xs-right ${
            article.favorited ? "active" : ""
          }`}
          onClick={() => onFavoriteClick?.(article.slug, article.favorited)}
        >
          <i className="ion-heart"></i> {article.favoritesCount}
        </button>
      </div>
      <a
        href={`/article/${article.slug}`}
        className="preview-link"
        onClick={(e) => {
          e.preventDefault();
          onArticleClick?.(article.slug);
        }}
      >
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag, index) => (
            <li
              key={index}
              className="tag-default tag-pill tag-outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTagClick?.(tag);
              }}
              style={{ cursor: "pointer" }}
            >
              {tag}
            </li>
          ))}
        </ul>
      </a>
    </div>
  );
};