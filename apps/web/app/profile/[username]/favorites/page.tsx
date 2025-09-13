import { ProfilePage } from "@repo/ui/pages";

interface ProfileFavoritesProps {
  params: Promise<{
    username: string;
  }>;
}

export default function ProfileFavorites({ params }: ProfileFavoritesProps) {
  return <ProfilePage />;
}