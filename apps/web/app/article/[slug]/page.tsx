import { ArticlePage } from "@repo/ui/pages";

interface ArticleProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function Article({ params }: ArticleProps) {
  return <ArticlePage />;
}