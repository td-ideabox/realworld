import type { Story } from "@ladle/react";
import { ArticleForm } from "./article-form";

const existingArticle = {
  title: "How to Build Scalable Web Apps",
  description: "A comprehensive guide to building web applications that can handle growth.",
  body: `# Introduction

Building scalable web applications is crucial for modern development.

## Key Principles

1. **Performance** - Optimize for speed
2. **Reliability** - Ensure uptime
3. **Maintainability** - Keep code clean

### Example Code

\`\`\`javascript
function optimizePerformance() {
  return "Use caching and lazy loading";
}
\`\`\`

This guide covers all the essential aspects.`,
  tagList: ["webdev", "scalability", "performance", "javascript"]
};

export const NewArticle: Story = () => (
  <ArticleForm
    onSubmit={(articleData) => console.log("Article created:", articleData)}
  />
);

export const EditArticle: Story = () => (
  <ArticleForm
    initialData={existingArticle}
    onSubmit={(articleData) => console.log("Article updated:", articleData)}
    isEditing={true}
  />
);

export const WithErrors: Story = () => (
  <ArticleForm
    onSubmit={(articleData) => console.log("Article created:", articleData)}
    errors={["Title is required", "Description cannot be empty", "Body must be at least 10 characters"]}
  />
);

export const Loading: Story = () => (
  <ArticleForm
    onSubmit={(articleData) => console.log("Article created:", articleData)}
    loading={true}
  />
);

export const LoadingEdit: Story = () => (
  <ArticleForm
    initialData={existingArticle}
    onSubmit={(articleData) => console.log("Article updated:", articleData)}
    isEditing={true}
    loading={true}
  />
);

NewArticle.meta = {
  title: "Forms/ArticleForm",
  description: "Create new article form"
};

EditArticle.meta = {
  title: "Forms/ArticleForm/Edit Mode"
};

WithErrors.meta = {
  title: "Forms/ArticleForm/With Errors"
};

Loading.meta = {
  title: "Forms/ArticleForm/Loading Create"
};

LoadingEdit.meta = {
  title: "Forms/ArticleForm/Loading Edit"
};