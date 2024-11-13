import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
//import fetchModel from "../../lib/fetchModelData";
import "./styles.css";
import axios from 'axios';

function UserDetail({userId}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`/user/${userId}`).then((response) => {
      if (response.data) {
        setUser(response.data);
      } else {
        console.error("Failed to fetch user details:", response.error);
      }
    });
  }, [userId]);

  // If user is not found, display a message
  if (!user) return <Typography variant="body1">User not found</Typography>;

  return (
    <div className="user-detail">
      <Typography variant="h4">
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body1">
        <strong>Location:</strong> {user.location}
      </Typography>
      <Typography variant="body1">
        <strong>Occupation:</strong> {user.occupation}
      </Typography>
      <Typography variant="body1">
        <strong>Description:</strong> {user.description}
      </Typography>
      <Typography variant="body1" style={{ marginTop: "16px" }}>
        <Link to={`/photos/${user._id}`}>View Photos</Link>
      </Typography>
    </div>
  );
}

export default UserDetail;
