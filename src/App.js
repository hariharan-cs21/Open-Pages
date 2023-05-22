import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import Home from "./pages/Home"
import Create from "./pages/Create"
import { auth } from "./config/firebaseconfig";
import { signOut } from "firebase/auth";
import { Menu } from "semantic-ui-react";
import YourPost from "./pages/YourPost"
import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const [isloggedIn, setloggedIn] = useState(localStorage.getItem("isLogged"))
  const [user] = useAuthState(auth)
  const LogutUser = () => {
    signOut(auth).then(() => {
      localStorage.clear()
      setloggedIn(false)
    })
  }

  const [menuCollapsed, setMenuCollapsed] = useState(localStorage.getItem("menuCollapsed") === "true");
  const handleMenuToggle = () => {
    setMenuCollapsed(!menuCollapsed);
  }

  useEffect(() => {
    localStorage.setItem("menuCollapsed", menuCollapsed);
  }, [menuCollapsed]);

  return (

    <Router>
      <Menu inverted stackable size="large">
        {isloggedIn && (
          <Menu.Item>
            Welcome
            <p style={{ fontSize: '1rem', marginLeft: '5px' }}>{user?.displayName}!</p>
          </Menu.Item>
        )}
        <Menu.Item onClick={handleMenuToggle}>
          <i className={`bars icon ${menuCollapsed ? 'show' : 'hide'}`} />
        </Menu.Item>
        <div className="header item" style={{ fontSize: "1.4rem", marginLeft: "20%" }}>
          Open Pages
        </div>
        {!menuCollapsed && (
          <>
            <Menu.Item as={Link} to="/" position="right" name="home" />
            <Menu.Item as={Link} to="/create" name="start posting" />
            {isloggedIn && (
              <Menu.Item as={Link} to="/yourpost" name="Your Posts" />
            )}
            <Menu.Menu position="left">
              {!isloggedIn && (
                <Menu.Item as={Link} to="/login" className="loginbtn" name="login" />
              )}
              {isloggedIn && (
                <Menu.Item
                  as={Link}
                  to="/login"
                  className="logoutBtn"
                  name="logout"
                  onClick={LogutUser}
                />
              )}
              {isloggedIn && (
                <Menu.Item>
                  <img
                    src={user?.photoURL}
                    style={{ borderRadius: '50%', fontSize: '14px' }}
                    alt="profile"
                  />
                </Menu.Item>
              )}
            </Menu.Menu>
          </>
        )}
      </Menu>
      <Routes>
        <Route path="/" element={<Home isloggedIn={isloggedIn} />} />
        <Route path="/create" element={<Create isloggedIn={isloggedIn} />} />
        <Route path="/yourpost" element={<YourPost isloggedIn={isloggedIn} />} />
        <Route path="/login" element={<Login setloggedIn={setloggedIn} />} />
      </Routes>

    </Router >
  );
}

export default App;
