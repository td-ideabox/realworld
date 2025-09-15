"use client";

interface User {
  username: string;
  image?: string;
}

interface HeaderProps {
  user?: User | null;
  onHomeClick?: () => void;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onNewArticleClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onSignOutClick?: () => void;
}

export const Header = ({
  user,
  onHomeClick,
  onLoginClick,
  onRegisterClick,
  onNewArticleClick,
  onSettingsClick,
  onProfileClick,
  onSignOutClick
}: HeaderProps) => {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a
          className="navbar-brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onHomeClick?.();
          }}
        >
          conduit
        </a>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <a
              className="nav-link active"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onHomeClick?.();
              }}
            >
              Home
            </a>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/editor"
                  onClick={(e) => {
                    e.preventDefault();
                    onNewArticleClick?.();
                  }}
                >
                  <i className="ion-compose"></i>&nbsp;New Article
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/settings"
                  onClick={(e) => {
                    e.preventDefault();
                    onSettingsClick?.();
                  }}
                >
                  <i className="ion-gear-a"></i>&nbsp;Settings
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href={`/profile/${user.username}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onProfileClick?.();
                  }}
                >
                  {user.image && (
                    <img src={user.image} className="user-pic" alt={user.username} />
                  )}
                  {user.username}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onSignOutClick?.();
                  }}
                >
                  Sign out
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    onLoginClick?.();
                  }}
                >
                  Sign in
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/register"
                  onClick={(e) => {
                    e.preventDefault();
                    onRegisterClick?.();
                  }}
                >
                  Sign up
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};