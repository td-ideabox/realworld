import { EditorPage } from "@repo/ui/pages";

interface EditArticleProps {
  params: Promise<{
    slug: string;
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function EditArticle({ params: _ }: EditArticleProps) {
  return <EditorPage />;
}