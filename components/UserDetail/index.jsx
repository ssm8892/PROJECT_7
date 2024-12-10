/*
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
*/

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Typography, Card, CardContent, CardMedia } from "@mui/material";
import axios from "axios";
import "./styles.css";

function UserDetail({ userId }) {
  const [user, setUser] = useState(null);
  const [mentionedPhotos, setMentionedPhotos] = useState([]);

  useEffect(() => {
    
    setUser(null);
    setMentionedPhotos([]);

    // Fetch user details
    console.log("userId in detail: ", userId);
    axios.get(`/user/${userId}`).then((response) => {
      if (response.data) {
        setUser(response.data);
      } else {
        console.error("Failed to fetch user details:", response.error);
      }
    });

    // Fetch photos where the user is mentioned
    axios.get(`/photosWithMentions/${userId}`).then((response) => {
      if (response.data) {
        setMentionedPhotos(response.data);
      } else {
        console.error("Failed to fetch mentioned photos:", response.error);
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

      <Typography variant="h5" style={{ marginTop: "32px" }}>
        Photos Mentioning {user.first_name}:
      </Typography>
      {mentionedPhotos.length > 0 ? (
        <div className="mentioned-photos">
          {mentionedPhotos.map((photo) => (
            <Card key={photo._id} style={{ margin: "16px", width: "300px" }}>
              <CardMedia
                component="img"
                alt="Mentioned Photo"
                height="140"
                image={`./images/${photo.file_name}`}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  <strong>Photo Owner:</strong>{" "}
                  <Link to={`/users/${photo.user_id}`}>
                    PHOTO_OWNER
                  </Link>
                </Typography>
                <Typography variant="body2">
                  <Link to={`/photos/${photo.user_id}/${photo._id}`}>
                    View Photo
                  </Link>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Typography>No photos mention this user.</Typography>
      )}
    </div>
  );
}

export default UserDetail;

