import React, { useState, useEffect, useRef } from "react";
import { Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function UserActivity() {
  const [activityList, setActivityList] = useState([]);
  const [delay, setDelay] = useState(100);

  useInterval(() => {
    axios.get("/activity").then((response) => {
        console.log(response.data);
        Promise.all(
            response.data.map(async (activity) => {
                const user = (await axios.get(`/user/${activity.user_id}`)).data;
                let activityData = {
                    user: user,
                    date: activity.date,
                };
                switch(activity.type) {
                    case 'userLogin':
                        activityData.string = 'logged in.';
                        break;
                    case 'userLogout':
                        activityData.string = 'logged out';
                        break;
                    case 'userRegister':
                        activityData.string = 'registered a new account.';
                        break;
                    case 'commentUpload':
                        activityData.string = 'uploaded a comment.';
                        activityData.photo = (await axios.get(`/photo/${activity.photo_id}`)).data;
                        break;
                    case 'photoUpload':
                        activityData.string = 'uploaded a photo.';
                        activityData.photo = (await axios.get(`/photo/${activity.photo_id}`)).data;
                        break;
                    default:
                        activityData.string = 'did an activity.';
                }
                return activityData;
            })
        ).then((activities) => {setActivityList(activities); setDelay(10000); });
    }).catch((error) => {
      console.error("Failed to fetch activity list:", error);
    });
  });

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
            
            return () => {clearInterval(id); }
        }
    }, [delay]);
  }

  return (
    <>
      <List component="nav">
        {activityList.map((item) => {
          console.log(item);
          const activityDate = new Date(item.date);
          return (
            <React.Fragment key={item._id}>
              {item.photo ? (
                <>
                  <ListItem component={Link} to={`/photos/${item.photo.user_id}/${item.photo._id}`} button>
                    <ListItemAvatar>
                      <Avatar src={`images/${item.photo.file_name}`} />
                    </ListItemAvatar>
                    <ListItemText primary={`${activityDate.toLocaleString('en-US')} | ${item.user.first_name} ${item.user.last_name} ${item.string}`} />
                  </ListItem>
                  <Divider />
                </>
              ) : (
                <>
                  <ListItem>
                    <ListItemText primary={`${activityDate.toLocaleString('en-US')} | ${item.user.first_name} ${item.user.last_name} ${item.string}`} />
                  </ListItem>
                  <Divider />
                </>
              )
              }
            </React.Fragment>
          );
        })}
      </List>
    </>
  );
}

export default UserActivity;
