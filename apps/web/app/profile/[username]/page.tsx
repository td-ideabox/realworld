import { ProfilePage } from "@repo/ui/pages";

interface ProfileProps {
  params: Promise<{
    username: string;
  }>;
}

export default function Profile({ params }: ProfileProps) {
  return <ProfilePage />;
}