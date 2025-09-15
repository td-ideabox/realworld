"use client";

import { useState } from "react";

interface ArticleData {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

interface ArticleFormProps {
  initialData?: Partial<ArticleData>;
  onSubmit: (articleData: ArticleData) => void;
  loading?: boolean;
  errors?: string[];
  isEditing?: boolean;
}

export const ArticleForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  errors = [],
  isEditing = false
}: ArticleFormProps) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [body, setBody] = useState(initialData.body || "");
  const [tags, setTags] = useState((initialData.tagList || []).join(", "));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagList = tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onSubmit({
      title,
      description,
      body,
      tagList
    });
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {errors.length > 0 && (
              <ul className="error-messages">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    disabled={loading}
                    required
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags (separated by commas)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    disabled={loading}
                  />
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? (isEditing ? "Updating..." : "Publishing...")
                    : (isEditing ? "Update Article" : "Publish Article")
                  }
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};