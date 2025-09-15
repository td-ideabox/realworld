import { ProfilePage } from "@repo/ui/pages";

interface ProfileProps {
  params: Promise<{
    username: string;
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Profile({ params: _ }: ProfileProps) {
  return <ProfilePage />;
}