"use client";

interface User {
  username: string;
  bio?: string;
  image?: string;
  following?: boolean;
}

interface UserInfoProps {
  user: User;
  currentUser?: User | null;
  onFollowClick?: (username: string, following: boolean) => void;
  onEditProfileClick?: () => void;
}

export const UserInfo = ({ user, currentUser, onFollowClick, onEditProfileClick }: UserInfoProps) => {
  const isOwnProfile = currentUser?.username === user.username;

  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <img src={user.image} className="user-img" alt={user.username} />
            <h4>{user.username}</h4>
            <p>{user.bio || ""}</p>
            {isOwnProfile ? (
              <button
                className="btn btn-sm btn-outline-secondary action-btn"
                onClick={onEditProfileClick}
              >
                <i className="ion-gear-a"></i>
                &nbsp; Edit Profile Settings
              </button>
            ) : (
              <button
                className={`btn btn-sm action-btn ${
                  user.following ? "btn-secondary" : "btn-outline-secondary"
                }`}
                onClick={() => onFollowClick?.(user.username, user.following || false)}
              >
                <i className="ion-plus-round"></i>
                &nbsp; {user.following ? "Unfollow" : "Follow"} {user.username}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};