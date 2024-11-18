import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, FormControlLabel, Checkbox, Button } from "@mui/material";
import { useLocation, Link, useNavigate } from "react-router-dom";
//import fetchModel from "../../lib/fetchModelData";
import "./styles.css";
import axios from 'axios';

function TopBar({ onToggleAdvancedFeatures, loggedInUser, onLogout }) {
  const location = useLocation();
  const [contextText, setContextText] = useState("Home Page");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isAdvancedEnabled, setIsAdvancedEnabled] = useState(false);

  useEffect(() => {
    const userIdMatch = location.pathname.match(/\/(users|photos)\/(\w+)/);
    const userId = userIdMatch ? userIdMatch[2] : null;

    if (userId && loggedInUser) {
      setLoading(true);

      axios.get(`/user/${userId}`)
        .then((response) => {
          if (response.data) {
            const user = response.data;
            if (location.pathname.startsWith("/users/")) {
              setContextText(`${user.first_name} ${user.last_name}`);
            } else if (location.pathname.startsWith("/photos/")) {
              setContextText(`Photos of ${user.first_name} ${user.last_name}`);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
          setContextText("Error loading user");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setContextText("Home Page");
    }
  }, [location]);

  useEffect(() => {
    axios.post('/admin/currentUser')
      .then((response) => {
        if (response.data) {
          const first_name = response.data.first_name;
          if (loggedInUser && !location.pathname.startsWith("/users/") && !location.pathname.startsWith("/photos/")) {
            setContextText(`Welcome ${first_name}`);
          }
        }
      });
  });

  useEffect(() => {
    if (!loggedInUser) {
      setContextText("Please Log In");
    }
  });

  const handleAdvancedToggle = () => {
    setIsAdvancedEnabled((prev) => !prev);
    onToggleAdvancedFeatures(!isAdvancedEnabled);
  };

  const handleLogOut = () => {
    onLogout();
    navigate("/");
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" style={{ flex: 1 }}>
          Sai Motukuri & Aubrey Feldker
        </Typography>

        {loggedInUser && (
          <>
            <FormControlLabel
              control={

                <Checkbox checked={isAdvancedEnabled} onChange={handleAdvancedToggle} color="secondary" />
              }
              label="Enable Advanced Features"
            />
            <Button variant="contained" onClick={handleLogOut}>Logout</Button>
            <Button variant="contained" component={Link} to={`/uploadView`} >UPLOAD NEW PHOTO</Button>
          </>
        )}
        {!loggedInUser && (
          <>
            <Button variant="contained" component={Link} to={`/loginView`} >Login</Button>
            <Button variant="contained" component={Link} to={`/registerView`} >Register</Button>
          </>
        )}
        <Typography variant="h5" color="inherit" style={{ marginRight: 16 }}>
          {loading ? "Loading..." : contextText}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
