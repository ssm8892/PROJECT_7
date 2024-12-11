/*
import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
//import fetchModel from "../../lib/fetchModelData";
import "./styles.css";
import axios from 'axios';

function UserPhotos({ userId, photoId, isAdvancedEnabled }) {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");

  const fetchPhotos = () => {
    axios.get(`/photosOfUser/${userId}`).then((response) => {
      if (response.data && Array.isArray(response.data)) {
        setPhotos(response.data);
  
        if (photoId) {
          const initialIndex = response.data.findIndex((photo) => photo._id === photoId);
          setCurrentPhotoIndex(initialIndex >= 0 ? initialIndex : 0);
        } else {
          setCurrentPhotoIndex(0);
        }
      } else {
        setPhotos([]);
      }
    });
  };

  useEffect(() => {
    fetchPhotos();
  
    axios.post("/admin/currentUser")
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, [userId, photoId]);

  const goToNextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      const nextIndex = currentPhotoIndex + 1;
      setCurrentPhotoIndex(nextIndex);
      navigate(`/photos/${userId}/${photos[nextIndex]._id}`);
    }
  };

  const handleCommentSubmit = async (e, photoID) => {
    e.preventDefault();
    console.log("HANDLE COMMENT SUBMIT IS TRIGGERED FOR PICTURE: ", photoID);
    
    try {
      axios.post(`/commentsOfPhoto/${photoID}`, { comment: newComment });

      setNewComment("");
      fetchPhotos();

    } catch (err) {
      console.error("Error adding comment:", err);
    }
};

  const goToPreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      const prevIndex = currentPhotoIndex - 1;
      setCurrentPhotoIndex(prevIndex);
      navigate(`/photos/${userId}/${photos[prevIndex]._id}`);
    }
  };

  if (!photos || photos.length === 0) return <Typography variant="body1">No photos found</Typography>;

  const currentPhoto = photos[currentPhotoIndex];

  return (
    <div className="user-photos">
      <Typography variant="h4" gutterBottom>
        {isAdvancedEnabled ? "Advanced Photo Viewer" : `Basic Photo Viewer`}
      </Typography>
      {isAdvancedEnabled ? (
        // Advanced mode: single-photo viewer with navigation
        <div className="photo-item">
          <img src={`./images/${currentPhoto.file_name}`} alt="User" className="user-photo" />
          <Button onClick={goToPreviousPhoto} disabled={currentPhotoIndex === 0}>
            Previous
          </Button>
          <Button onClick={goToNextPhoto} disabled={currentPhotoIndex === photos.length - 1}>
            Next
          </Button>
          <Typography variant="subtitle1">Comments:</Typography>
          {currentPhoto.comments && currentPhoto.comments.length > 0 ? (
            currentPhoto.comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <Link to={`/users/${comment.user._id}`}>{comment.user.first_name} {comment.user.last_name}</Link>
                : {comment.comment}
              </div>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No comments.
            </Typography>
          )}
          {isLoggedIn && (
            
              <form>
                <label>
                  Add Comment
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </label>
                <button type="submit" onClick={(e) => handleCommentSubmit(e, currentPhoto._id)}>Submit</button>
              </form>
            
          )}
        </div>
      ) : (
        // Basic mode: show all photos with their details and comments
        photos.map((photo) => (
          <div key={photo._id} className="photo-item">
            <img src={`./images/${photo.file_name}`} alt="User" className="user-photo" />
            <Typography variant="body2" color="textSecondary">
              Date: {new Date(photo.date_time).toLocaleString()}
            </Typography>
            <Typography variant="subtitle1">Comments:</Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <Link to={`/users/${comment.user._id}`}>{comment.user.first_name} {comment.user.last_name}</Link>
                  : {comment.comment}
                </div>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No comments.
              </Typography>
            )}
            {isLoggedIn && (
              
                <form>
                  <label>
                    Add Comment
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </label>
                  <button type="submit" onClick={(e) => handleCommentSubmit(e, photo._id)}>Submit</button>
                </form>
              

            )}
          </div>
        ))
      )}
    </div>
  );
}

export default UserPhotos;
*/

/*

import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MentionsInput, Mention } from "react-mentions";
import axios from "axios";
import "./styles.css";

function UserPhotos({ userId, photoId, isAdvancedEnabled }) {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchPhotos = () => {
    axios.get(`/photosOfUser/${userId}`).then((response) => {
      if (response.data && Array.isArray(response.data)) {
        setPhotos(response.data);

        if (photoId) {
          const initialIndex = response.data.findIndex((photo) => photo._id === photoId);
          setCurrentPhotoIndex(initialIndex >= 0 ? initialIndex : 0);
        } else {
          setCurrentPhotoIndex(0);
        }
      } else {
        setPhotos([]);
      }
    });
  };

  const fetchUsers = () => {
    axios.get("/user/list").then((response) => {
      if (response.data) {
        setUsers(response.data.map((user) => ({
          id: user._id,
          display: `${user.first_name} ${user.last_name}`,
        })));
      }
    });
  };

  useEffect(() => {
    fetchPhotos();
    fetchUsers();

    axios
      .post("/admin/currentUser")
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, [userId, photoId]);

  const goToNextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      const nextIndex = currentPhotoIndex + 1;
      setCurrentPhotoIndex(nextIndex);
      navigate(`/photos/${userId}/${photos[nextIndex]._id}`);
    }
  };

  const goToPreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      const prevIndex = currentPhotoIndex - 1;
      setCurrentPhotoIndex(prevIndex);
      navigate(`/photos/${userId}/${photos[prevIndex]._id}`);
    }
  };

  const handleCommentSubmit = async (e, photoID) => {
    e.preventDefault();
    console.log("Submitting comment for photo: ", photoID);

    const mentions = [];
    const regex = /@\[(.+?)\]\((.+?)\)/g;
    let match;

    while ((match = regex.exec(newComment)) !== null) {
      mentions.push(match[2]); // Extract the user ID
    }

    try {
      await axios.post(`/commentsOfPhoto/${photoID}`, {
        comment: newComment,
        mentions,
      });

      setNewComment("");
      fetchPhotos();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (!photos || photos.length === 0)
    return <Typography variant="body1">No photos found</Typography>;

  const currentPhoto = photos[currentPhotoIndex];

  return (
    <div className="user-photos">
      <Typography variant="h4" gutterBottom>
        {isAdvancedEnabled ? "Advanced Photo Viewer" : `Basic Photo Viewer`}
      </Typography>
      {isAdvancedEnabled ? (
        <div className="photo-item">
          <img src={`./images/${currentPhoto.file_name}`} alt="User" className="user-photo" />
          <Button onClick={goToPreviousPhoto} disabled={currentPhotoIndex === 0}>
            Previous
          </Button>
          <Button onClick={goToNextPhoto} disabled={currentPhotoIndex === photos.length - 1}>
            Next
          </Button>
          <Typography variant="subtitle1">Comments:</Typography>
          {currentPhoto.comments && currentPhoto.comments.length > 0 ? (
            currentPhoto.comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <Link to={`/users/${comment.user._id}`}>
                  {comment.user.first_name} {comment.user.last_name}
                </Link>
                :{" "}
                {comment.comment.split(/(@\[[^\]]+\]\([^)]+\))/).map((part, index) => {
                  if (part.startsWith("@[")) {
                    const match = part.match(/@\[(.+?)\]\((.+?)\)/);
                    return match ? (
                      <Link key={index} to={`/users/${match[2]}`}>
                        @{match[1]}
                      </Link>
                    ) : (
                      part
                    );
                  }
                  return part;
                })}
              </div>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No comments.
            </Typography>
          )}
          {isLoggedIn && (
            <form>
              <label>
                Add Comment
                <MentionsInput
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ width: "100%", minHeight: "100px", marginTop: "8px" }}
                >
                  <Mention trigger="@" data={users} />
                </MentionsInput>
              </label>
              <button
                type="submit"
                onClick={(e) => handleCommentSubmit(e, currentPhoto._id)}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      ) : (
        photos.map((photo) => (
          <div key={photo._id} className="photo-item">
            <img src={`./images/${photo.file_name}`} alt="User" className="user-photo" />
            <Typography variant="body2" color="textSecondary">
              Date: {new Date(photo.date_time).toLocaleString()}
            </Typography>
            <Typography variant="subtitle1">Comments:</Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <Link to={`/users/${comment.user._id}`}>
                    {comment.user.first_name} {comment.user.last_name}
                  </Link>
                  : {comment.comment}
                </div>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No comments.
              </Typography>
            )}
            {isLoggedIn && (
              <form>
                <label>
                  Add Comment
                  <MentionsInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{ width: "100%", minHeight: "100px", marginTop: "8px" }}
                  >
                    <Mention trigger="@" data={users} />
                  </MentionsInput>
                </label>
                <button
                  type="submit"
                  onClick={(e) => handleCommentSubmit(e, photo._id)}
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default UserPhotos;
*/

import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MentionsInput, Mention } from "react-mentions";
import axios from "axios";
import "./styles.css";

function UserPhotos({ userId, photoId, isAdvancedEnabled }) {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchPhotos = () => {
    axios.get(`/photosOfUser/${userId}`).then((response) => {
      if (response.data && Array.isArray(response.data)) {
        setPhotos(response.data);

        if (photoId) {
          const initialIndex = response.data.findIndex((photo) => photo._id === photoId);
          setCurrentPhotoIndex(initialIndex >= 0 ? initialIndex : 0);
        } else {
          setCurrentPhotoIndex(0);
        }
      } else {
        setPhotos([]);
      }
    });
  };

  const fetchUsers = () => {
    axios.get("/user/list").then((response) => {
      if (response.data) {
        setUsers(response.data.map((user) => ({
          id: user._id.toString(),
          display: `${user.first_name} ${user.last_name}`,
        })));
      }
    });
  };

  useEffect(() => {
    fetchPhotos();
    fetchUsers();

    axios
      .post("/admin/currentUser")
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, [userId, photoId]);

  const goToNextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      const nextIndex = currentPhotoIndex + 1;
      setCurrentPhotoIndex(nextIndex);
      navigate(`/photos/${userId}/${photos[nextIndex]._id}`);
    }
  };

  const goToPreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      const prevIndex = currentPhotoIndex - 1;
      setCurrentPhotoIndex(prevIndex);
      navigate(`/photos/${userId}/${photos[prevIndex]._id}`);
    }
  };

  const handleCommentSubmit = async (e, photoID) => {
    e.preventDefault();
    console.log("Submitting comment for photo: ", photoID);

    const mentions = [];
    const regex = /@\[(.+?)\]\((.+?)\)/g;
    let match = regex.exec(newComment);

    while (match !== null) {
      mentions.push(match[2]); // Extract the user ID
      match = regex.exec(newComment);
    }

    try {
      console.log("mentions", mentions);
      await axios.post(`/commentsOfPhoto/${photoID}`, {
        comment: newComment,
        mentions,
      });

      setNewComment("");
      fetchPhotos();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const renderCommentWithMentions = (comment) => {
    return comment.split(/(@\[[^\]]+\]\([^)]+\))/).map((part, index) => {
      if (part.startsWith("@[")) {
        const match = part.match(/@\[(.+?)\]\((.+?)\)/);
        return match ? (
          <Link key={index} to={`/users/${match[2]}`}>
            @{match[1]}
          </Link>
        ) : (
          part
        );
      }
      return part;
    });
  };

  if (!photos || photos.length === 0) { return <Typography variant="body1">No photos found</Typography>;}

  const currentPhoto = photos[currentPhotoIndex];

  return (
    <div className="user-photos">
      <Typography variant="h4" gutterBottom>
        {isAdvancedEnabled ? "Advanced Photo Viewer" : `Basic Photo Viewer`}
      </Typography>
      {isAdvancedEnabled ? (
        <div className="photo-item">
          <img src={`./images/${currentPhoto.file_name}`} alt="User" className="user-photo" />
          <Button onClick={goToPreviousPhoto} disabled={currentPhotoIndex === 0}>
            Previous
          </Button>
          <Button onClick={goToNextPhoto} disabled={currentPhotoIndex === photos.length - 1}>
            Next
          </Button>
          <Typography variant="subtitle1">Comments:</Typography>
          {currentPhoto.comments && currentPhoto.comments.length > 0 ? (
            currentPhoto.comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <Link to={`/users/${comment.user._id}`}>
                  {comment.user.first_name} {comment.user.last_name}
                </Link>
                : {renderCommentWithMentions(comment.comment)}
              </div>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No comments.
            </Typography>
          )}
          {isLoggedIn && (
            <form>
              <label>
                Add Comment
                <MentionsInput
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ width: "100%", minHeight: "100px", marginTop: "8px" }}
                >
                  <Mention trigger="@" data={users} />
                </MentionsInput>
              </label>
              <button
                type="submit"
                onClick={(e) => handleCommentSubmit(e, currentPhoto._id)}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      ) : (
        photos.map((photo) => (
          <div key={photo._id} className="photo-item">
            <img src={`./images/${photo.file_name}`} alt="User" className="user-photo" />
            <Typography variant="body2" color="textSecondary">
              Date: {new Date(photo.date_time).toLocaleString()}
            </Typography>
            <Typography variant="subtitle1">Comments:</Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <Link to={`/users/${comment.user._id}`}>
                    {comment.user.first_name} {comment.user.last_name}
                  </Link>
                  : {renderCommentWithMentions(comment.comment)}
                </div>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No comments.
              </Typography>
            )}
            {isLoggedIn && (
              <form>
                <label>
                  Add Comment
                  <MentionsInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{ width: "100%", minHeight: "100px", marginTop: "8px" }}
                  >
                    <Mention trigger="@" data={users} />
                  </MentionsInput>
                </label>
                <button
                  type="submit"
                  onClick={(e) => handleCommentSubmit(e, photo._id)}
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default UserPhotos;
