import React, { useState, useEffect, useRef } from "react";
import { Divider, List, ListItem, ListItemText, Badge, ListItemAvatar, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function UserList({ isAdvancedEnabled }) {
  const [userlist, setUserlist] = useState([]);
  const [counts, setCounts] = useState({});
  const [delay, setDelay] = useState(100);

  //Function based off of https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  function useInterval(callback) {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            
            return () => {clearInterval(id); };
        }
        return 0;
    }, [delay]);
  }

  useInterval(() => {
    axios.get("/user/list").then(async (response) => {
        const userActivity = await axios.get("/user/list/activity");
        let userlistData = [];
        Promise.all(
            response.data.map(async (item) => {
            const thisUserActivity = userActivity.data.find((el) => item._id === el._id);
            if (thisUserActivity) { 
                switch(thisUserActivity.latest_activity[0][0]) {
                    case 'userLogin':
                        item.latest_activity = 'Logging in.';
                        break;
                    case 'userLogout':
                        item.latest_activity = 'Logging out';
                        break;
                    case 'userRegister':
                        item.latest_activity = 'Registering a new account.';
                        break;
                    case 'commentUpload':
                        item.latest_activity = 'Sending a comment.';
                        item.photo = (await axios.get(`/photo/${thisUserActivity.latest_activity[0][1]}`)).data;
                        break;
                    case 'photoUpload':
                        item.latest_activity = 'Uploading a photo.';
                        item.photo = (await axios.get(`/photo/${thisUserActivity.latest_activity[0][1]}`)).data;
                        break;
                    default:
                        item.latest_activity = 'did an activity.';
                }
            }
            if(item.is_user) { userlistData.unshift(item); }
            else { userlistData.push(item); }
            })
        ).then(() => {setUserlist(userlistData); setDelay(10000);});   
    }).catch((error) => {
      console.error("Failed to fetch user list:", error);
    });
  });

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
              {item.photo ? (
                <>
                    <ListItemAvatar>
                        <Avatar src={`images/${item.photo.file_name}`} variant="square" />
                    </ListItemAvatar>
                    <ListItemText sx={item.is_user && {color: '#1976D2', fontWeight: 700}}
                        primary={`${item.first_name} ${item.last_name}`}
                        secondary={item.latest_activity ? `Last seen: ${item.latest_activity}` : ''} />
                </>
               ) : (
                <ListItemText inset sx={item.is_user && {color: '#1976D2', fontWeight: 700}}
                    primary={`${item.first_name} ${item.last_name}`}
                    secondary={item.latest_activity ? `Last seen: ${item.latest_activity}` : ''} />
               )}
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
              {item.is_user && <Divider />}
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
}

export default UserList;
