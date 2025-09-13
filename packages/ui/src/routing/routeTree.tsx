import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { HomePage } from "../pages/Home";
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Register";
import { SettingsPage } from "../pages/Settings";
import { EditorPage } from "../pages/Editor";
import { ArticlePage } from "../pages/Article";
import { ProfilePage } from "../pages/Profile";

const rootRoute = createRootRoute({
  component: () => (
    <div>
      <nav className="navbar navbar-light">
        <div className="container">
          <a className="navbar-brand" href="index.html">
            conduit
          </a>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <a className="nav-link active" href="">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="">
                <i className="ion-compose"></i>&nbsp;New Article
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="">
                <i className="ion-gear-a"></i>&nbsp;Settings
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="">
                Sign up
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
      <footer>
        <div className="container">
          <a href="/" className="logo-font">
            conduit
          </a>
          <span className="attribution">
            An interactive learning project from{" "}
            <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </div>
  ),
});

// Home route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

// Authentication routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

// Editor routes
const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/editor",
  component: EditorPage,
});

const editorEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/editor/$slug",
  component: EditorPage,
});

// Article route
const articleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/article/$slug",
  component: ArticlePage,
});

// Profile routes
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$username",
  component: ProfilePage,
});

const profileFavoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$username/favorites",
  component: ProfilePage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  settingsRoute,
  editorRoute,
  editorEditRoute,
  articleRoute,
  profileRoute,
  profileFavoritesRoute,
]);
