import React, { useState, useEffect } from "react";
import { Divider, List, ListItem, ListItemText, Badge } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function UserList({ isAdvancedEnabled }) {
  const [userlist, setUserlist] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    axios.get("/user/list").then((response) => {
      setUserlist(response.data);
    }).catch((error) => {
      console.error("Failed to fetch user list:", error);
    });
  }, []);

  const fetchUserCounts = async (userId) => {
    try {
      const response = await axios.get(`/user/counts/${userId}`);
      setCounts((prevCounts) => ({
        ...prevCounts,
        [userId]: response.data
      }));
    } catch (error) {
      console.error(`Failed to fetch counts for user ${userId}:`, error);
    }
  };

  return (
    <div>
      <List component="nav">
        {userlist.map((item) => {
          if (isAdvancedEnabled && !counts[item._id]) {
            fetchUserCounts(item._id);
          }

          return (
            <React.Fragment key={item._id}>
              <ListItem component={Link} to={`/users/${item._id}`} button>
                <ListItemText primary={`${item.first_name} ${item.last_name}`} />

                {isAdvancedEnabled && counts[item._id] && (
                  <>
                    {/* Photo Count Bubble (Green) */}
                    <Badge
                      badgeContent={counts[item._id].photoCount || 0}
                      color="success"
                      component={Link} to={`/photos/${item._id}`}
                      className="count-badge clickable"
                    />

                    {/* Comment Count Bubble (Red) */}
                    <Badge
                      badgeContent={counts[item._id].commentCount || 0}
                      color="error"
                      component={Link} to={`/comments/${item._id}`}
                      className="count-badge clickable"
                    />
                  </>
                )}
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
}

export default UserList;
