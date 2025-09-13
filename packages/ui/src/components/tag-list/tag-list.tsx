"use client";

interface TagListProps {
  tags: string[];
  title?: string;
  onTagClick?: (tag: string) => void;
  loading?: boolean;
}

export const TagList = ({ tags, title = "Popular Tags", onTagClick, loading = false }: TagListProps) => {
  if (loading) {
    return (
      <div className="sidebar">
        <p>{title}</p>
        <div className="tag-list">
          <span>Loading tags...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <p>{title}</p>
      <div className="tag-list">
        {tags.length === 0 ? (
          <span>No tags are here... yet.</span>
        ) : (
          tags.map((tag, index) => (
            <a
              key={index}
              href=""
              className="tag-pill tag-default"
              onClick={(e) => {
                e.preventDefault();
                onTagClick?.(tag);
              }}
            >
              {tag}
            </a>
          ))
        )}
      </div>
    </div>
  );
};