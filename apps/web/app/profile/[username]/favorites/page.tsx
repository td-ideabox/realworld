import { ProfilePage } from "@repo/ui/pages";

interface ProfileFavoritesProps {
  params: Promise<{
    username: string;
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ProfileFavorites({ params: _ }: ProfileFavoritesProps) {
  return <ProfilePage />;
}