import type { Story } from "@ladle/react";
import { ArticleContent } from "./article-content";

const simpleText = `This is a simple article body with plain text.

It has multiple paragraphs and should display properly with line breaks.

Here's another paragraph with some content about web development and best practices.`;

const markdownText = `# This is a Markdown Article

This article demonstrates **markdown** rendering capabilities.

## Features

- Lists work great
- **Bold text** is supported
- *Italic text* too

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

> This is a blockquote that should be styled appropriately.

Visit [this link](https://example.com) for more information.`;

const mockMarkdownRenderer = (markdown: string) => {
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/```javascript\n([\s\S]*?)\n```/gim, '<pre><code>$1</code></pre>')
    .replace(/`([^`]*)`/gim, '<code>$1</code>')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    .replace(/\n/gim, '<br>');
};

export const PlainText: Story = () => (
  <ArticleContent body={simpleText} />
);

export const WithMarkdown: Story = () => (
  <ArticleContent
    body={markdownText}
    renderMarkdown={mockMarkdownRenderer}
  />
);

export const ShortContent: Story = () => (
  <ArticleContent body="This is a short article with just one paragraph." />
);

export const CodeContent: Story = () => (
  <ArticleContent
    body={`Here's some code:

function example() {
  const message = "Hello, world!";
  console.log(message);
  return message;
}

This code demonstrates a simple function.`}
  />
);

PlainText.meta = {
  title: "Article/ArticleContent",
  description: "Article body content display"
};

WithMarkdown.meta = {
  title: "Article/ArticleContent/With Markdown"
};

ShortContent.meta = {
  title: "Article/ArticleContent/Short"
};

CodeContent.meta = {
  title: "Article/ArticleContent/Code Example"
};