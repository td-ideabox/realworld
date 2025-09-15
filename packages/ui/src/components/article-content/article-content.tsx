"use client";

interface ArticleContentProps {
  body: string;
  renderMarkdown?: (markdown: string) => string;
}

export const ArticleContent = ({ body, renderMarkdown }: ArticleContentProps) => {
  const processedBody = renderMarkdown ? renderMarkdown(body) : body;

  return (
    <div className="row article-content">
      <div className="col-md-12">
        {renderMarkdown ? (
          <div dangerouslySetInnerHTML={{ __html: processedBody }} />
        ) : (
          <div style={{ whiteSpace: "pre-wrap" }}>{processedBody}</div>
        )}
      </div>
    </div>
  );
};