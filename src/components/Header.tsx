"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== "undefined") {
          setIsLoggedIn(localStorage.getItem("ham_auth") === "1");
          setIsAdmin(localStorage.getItem("ham_admin") === "1");
        }
      } catch {}
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ham_auth");
    localStorage.removeItem("ham_admin");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <header>
      <h1>Ham Society</h1>

      {isLoggedIn ? (
        <div>
          {isAdmin && <span>Admin</span>}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <span>Not logged in</span>
      )}
    </header>
  );
}
