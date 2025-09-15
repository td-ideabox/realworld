"use client";

interface Author {
  username: string;
  bio?: string;
  image?: string;
  following?: boolean;
}

interface CommentData {
  id: number;
  createdAt: string;
  updatedAt?: string;
  body: string;
  author: Author;
}

interface CommentProps {
  comment: CommentData;
  currentUser?: { username: string } | null;
  onDeleteClick?: (commentId: number) => void;
  onAuthorClick?: (username: string) => void;
}

export const Comment = ({ comment, currentUser, onDeleteClick, onAuthorClick }: CommentProps) => {
  const canDelete = currentUser?.username === comment.author.username;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <a
          href={`/profile/${comment.author.username}`}
          className="comment-author"
          onClick={(e) => {
            e.preventDefault();
            onAuthorClick?.(comment.author.username);
          }}
        >
          <img src={comment.author.image} className="comment-author-img" alt={comment.author.username} />
        </a>
        &nbsp;
        <a
          href={`/profile/${comment.author.username}`}
          className="comment-author"
          onClick={(e) => {
            e.preventDefault();
            onAuthorClick?.(comment.author.username);
          }}
        >
          {comment.author.username}
        </a>
        <span className="date-posted">{formatDate(comment.createdAt)}</span>
        {canDelete && (
          <span className="mod-options">
            <i
              className="ion-trash-a"
              onClick={() => onDeleteClick?.(comment.id)}
              style={{ cursor: "pointer" }}
            ></i>
          </span>
        )}
      </div>
    </div>
  );
};