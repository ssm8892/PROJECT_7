import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Typography, List, ListItem, ListItemText, Avatar } from "@mui/material";

function UserComments({ isAdvancedEnabled }) {
  const { userId } = useParams(); // The ID of the user whose comments we're viewing
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user comments along with associated photo details
    axios.get(`/commentsOfUser/${userId}`).then((response) => {
      setComments(response.data);
    }).catch((error) => {
      console.error("Error fetching user comments:", error);
    });
  }, [userId]);

  const handleCommentClick = async (photoId) => {
    try {
      // Fetch the photo to get its owner's ID
      const response = await axios.get(`/photo/${photoId}`);
      const photoOwnerId = response.data.user_id; // Assuming response has user_id as owner

      // Navigate to the advanced photo viewer for the photo under the correct user
      navigate(`/photos/${photoOwnerId}/${photoId}`);
    } catch (error) {
      console.error("Error fetching photo owner:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {isAdvancedEnabled ? "Advanced Comments View" : "Comments"}
      </Typography>
      <List>
        {comments.length ? (
          comments.map((comment) => (
            <ListItem 
              key={comment._id} 
              onClick={() => isAdvancedEnabled && handleCommentClick(comment.photo_id)} 
              button={isAdvancedEnabled} // Only make clickable if advanced features are enabled
            >
              {/* Display a thumbnail of the associated photo */}
              {isAdvancedEnabled && (
                <Avatar
                  src={`/images/${comment.photo_file_name}`} // Path to the photo thumbnail
                  alt="Thumbnail"
                  style={{ marginRight: "10px" }}
                />
              )}
              <ListItemText
                primary={comment.comment}
                secondary={`Posted by ${comment.user.first_name} ${comment.user.last_name}`}
              />
            </ListItem>
          ))
        ) : (
          <Typography>No comments found for this user.</Typography>
        )}
      </List>
    </div>
  );
}

export default UserComments;
