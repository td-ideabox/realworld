import { ArticlePage } from "@repo/ui/pages";

interface ArticleProps {
  params: Promise<{
    slug: string;
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Article({ params: _ }: ArticleProps) {
  return <ArticlePage />;
}