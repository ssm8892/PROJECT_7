import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Grid, Paper } from "@mui/material";
import { Redirect } from 'react-router'
import { HashRouter, Route, Routes, useParams } from "react-router-dom";
import axios from "axios";
import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";
import LoginForm from "./components/LoginForm";
import UploadPhoto from "./components/UploadPhoto";
import LoginRedirect from "./components/LoginRedirect";
import RegisterForm from "./components/RegisterForm";
import UserActivity from "./components/UserActivity";

function UserDetailRoute() {
  const { userId } = useParams();
  return <UserDetail userId={userId} />;
}

function UserPhotosRoute({ isAdvancedEnabled }) {
  const { userId, photoId } = useParams();
  return <UserPhotos userId={userId} photoId={photoId} isAdvancedEnabled={isAdvancedEnabled} />;
}

function PhotoShare() {
  const [isAdvancedEnabled, setIsAdvancedEnabled] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  
  const handleLogin = async (loginName, password) => {
    try {
      const response = await axios.post("/admin/login", { login_name: loginName, password: password });
      setLoggedInUser(response.data);
    } catch (error) {
      console.error("Login failed: ", error);
      alert("Login failed. Please try again.");
    }
  }

  const handleRegistration = async (credentials) => {
    try {
      const response = await axios.post("/user", credentials);
      setLoggedInUser(response.data);
    } catch (error) {
      console.error("Login failed: ", error);
      alert(`Login failed. ${error.response.data.message}`);
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post("/admin/logout");
      setLoggedInUser(null);
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  }

  return (
    <HashRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar loggedInUser={loggedInUser}
              onToggleAdvancedFeatures={setIsAdvancedEnabled}
              onLogout = {handleLogout} />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              {loggedInUser && <UserList isAdvancedEnabled={isAdvancedEnabled} />}
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                {loggedInUser ? (
                  <>
                    <Route path="/"/>
                    <Route path="/users/:userId" element={<UserDetailRoute />} />
                    <Route
                      path="/photos/:userId"
                      element={<UserPhotosRoute isAdvancedEnabled={isAdvancedEnabled} />}
                    />
                    <Route
                      path="/photos/:userId/:photoId"
                      element={<UserPhotosRoute isAdvancedEnabled={isAdvancedEnabled} />}
                    />
                    <Route
                      path="/comments/:userId"
                      element={<UserComments isAdvancedEnabled={isAdvancedEnabled} />}
                    />
                    <Route 
                      path="/uploadView"
                      element={<UploadPhoto />}
                    />
                    <Route 
                      path="/activityView"
                      element={<UserActivity />}
                    />
                  </>
                ) : (
                  <>
                    <Route
                        path="/"
                        element={<LoginRedirect />}
                    />
                    <Route
                        path="/loginView"
                        element={<LoginForm onLogin={handleLogin}/>}
                    />
                    <Route
                        path="/registerView"
                        element={<RegisterForm onLogin={handleRegistration}/>}
                    />
                  </>
                )}
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </HashRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("photoshareapp"));
root.render(<PhotoShare />);
