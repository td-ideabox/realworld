"use client";

import { useState } from "react";

interface User {
  username: string;
  image?: string;
}

interface CommentFormProps {
  user?: User | null;
  onSubmit: (body: string) => void;
  onLoginClick?: () => void;
  loading?: boolean;
  errors?: string[];
}

export const CommentForm = ({ user, onSubmit, onLoginClick, loading = false, errors = [] }: CommentFormProps) => {
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (body.trim()) {
      onSubmit(body);
      setBody("");
    }
  };

  if (!user) {
    return (
      <div className="row">
        <div className="col-xs-12 col-md-8 offset-md-2">
          <p>
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                onLoginClick?.();
              }}
            >
              Sign in
            </a>{" "}
            or{" "}
            <a
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                onLoginClick?.();
              }}
            >
              sign up
            </a>{" "}
            to add comments on this article.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="card comment-form" onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <ul className="error-messages">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      <div className="card-block">
        <textarea
          className="form-control"
          placeholder="Write a comment..."
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={loading}
          required
        ></textarea>
      </div>
      <div className="card-footer">
        <img src={user.image} className="comment-author-img" alt={user.username} />
        <button className="btn btn-sm btn-primary" type="submit" disabled={loading || !body.trim()}>
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
};