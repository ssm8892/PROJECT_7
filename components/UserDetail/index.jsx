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
import { Typography, Card, CardContent, CardMedia, CardActionArea, Grid } from "@mui/material";
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
    axios.get(`/user/${userId}`).then(async (response) => {
      if (response.data) {
        let userData = response.data;
        userData.recentPhoto = (await axios.get(`/photosOfUser/${userId}/recent`)).data[0];
        if (userData.recentPhoto) {
            userData.recentPhoto.date_time = new Date(userData.recentPhoto.date_time);
            userData.mostLikedPhoto = (await axios.get(`/photosOfUser/${userId}/mostLiked`)).data[0];
        }
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
        
        <Grid container spacing={0.5}>
            {user.recentPhoto && (
                <Grid item xs={6}>
                    <Card style={{ margin: "16px", width: "300px" }}>
                        <CardActionArea href={`#/photos/${user._id}/${user.recentPhoto._id}`}>
                            <CardMedia
                                component="img"
                                alt="Most Recent Photo"
                                height="140"
                                image={`./images/${user.recentPhoto.file_name}`}
                            />
                        </CardActionArea>
                        <CardContent>
                            <Typography variant="body2" color="textSecondary">
                            <strong>Most Recent Photo</strong>{" - "} {user.recentPhoto.date_time.toLocaleDateString('en-US')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
            {user.mostLikedPhoto && (
                <Grid item xs={6}>
                    <Card style={{ margin: "16px", width: "300px" }}>
                        <CardActionArea href={`#/photos/${user._id}/${user.mostLikedPhoto._id}`}>
                            <CardMedia
                                component="img"
                                alt="Most Recent Photo"
                                height="140"
                                image={`./images/${user.mostLikedPhoto.file_name}`}
                            />
                        </CardActionArea>
                        <CardContent>
                            <Typography variant="body2" color="textSecondary">
                            <strong>Most Popular Photo</strong>{" - "} {user.mostLikedPhoto.num_comments} Comment{user.mostLikedPhoto.num_comments !== 1 && "s"}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            )}
        </Grid>
        <Typography variant="body1" style={{ marginTop: "16px" }}>
            <Link to={`/photos/${user._id}`}>View Photos</Link>
        </Typography>

        <Typography variant="h5" style={{ marginTop: "32px" }}>
            Photos Mentioning {user.first_name}:
        </Typography>
        {mentionedPhotos.length > 0 ? (
            <Grid container>
            {mentionedPhotos.map((photo) => (
                <Grid item xs={3} key={photo._id}>
                    <Card style={{ margin: "16px", width: "300px" }}>
                        <CardActionArea href={`#/photos/${photo.user_id}/${photo._id}`}>
                            <CardMedia
                                component="img"
                                alt="Mentioned Photo"
                                height="140"
                                image={`./images/${photo.file_name}`}
                            />
                        </CardActionArea>
                        <CardContent>
                            <Typography variant="body2" color="textSecondary">
                            <strong>Photo Owner:</strong>{" "}
                            <Link to={`/users/${photo.user_id}`}>
                                PHOTO_OWNER
                            </Link>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
            </Grid>
        ) : (
            <Typography>No photos mention this user.</Typography>
      )}
    </div>
  );
}

export default UserDetail;

