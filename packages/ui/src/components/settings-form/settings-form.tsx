"use client";

import { useState, useEffect } from "react";

interface User {
  username: string;
  email: string;
  bio?: string;
  image?: string;
}

interface SettingsFormProps {
  user: User;
  onSubmit: (userData: Partial<User> & { password?: string }) => void;
  onLogout: () => void;
  loading?: boolean;
  errors?: string[];
}

export const SettingsForm = ({ user, onSubmit, onLogout, loading = false, errors = [] }: SettingsFormProps) => {
  const [image, setImage] = useState(user.image || "");
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setImage(user.image || "");
    setUsername(user.username || "");
    setBio(user.bio || "");
    setEmail(user.email || "");
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData: Partial<User> & { password?: string } = {
      image,
      username,
      bio,
      email
    };
    if (password) {
      userData.password = password;
    }
    onSubmit(userData);
  };

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            {errors.length > 0 && (
              <ul className="error-messages">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="url"
                    placeholder="URL of profile picture"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    disabled={loading}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={loading}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </fieldset>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Settings"}
                </button>
              </fieldset>
            </form>
            <hr />
            <button
              className="btn btn-outline-danger"
              onClick={onLogout}
              disabled={loading}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};