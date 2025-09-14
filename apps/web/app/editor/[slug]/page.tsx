import { EditorPage } from "@repo/ui/pages";

interface EditArticleProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function EditArticle({ params }: EditArticleProps) {
  return <EditorPage />;
}