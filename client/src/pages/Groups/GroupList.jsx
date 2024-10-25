import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const GroupList = ({ groups }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <>
      {/* Changed Typography to render as a div */}
      <Typography
        component="div"
        sx={{
          fontSize: "28px",
          padding: "10px",
          display: "flex",
          justifyContent: "space-around",
        }}>
        <Box
          sx={{
            backgroundColor: "#484a48",
            padding: "0px 13px",
            borderRadius: "50px",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            ":hover": {
              backgroundColor: "#7f7f7f",
            },
          }}
          onClick={() => {
            handleNavigate();
          }}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Box>
        My Groups
      </Typography>

      <List
        sx={{
          width: "100%",
        }}>
        {groups?.map((group, i) => {
          return (
            <Link
              key={i}
              to={`?group=${group._id}`}
              style={{
                textDecoration: "none",
                color: "white",
              }}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  ":hover": {
                    backgroundColor: "background.paper",
                  },
                }}>
                <ListItemAvatar>
                  {group.avatar ? (
                    <Avatar
                      alt={group.name}
                      src={group.avatar}
                      sx={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}>
                      {group?.name?.slice(0, 2)?.toUpperCase()}
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    color: "text.primary",
                  }}
                  primary={group.name}
                  secondary={
                    <Typography
                      component="span" // Changed to "span" to avoid <div> inside <p>
                      variant="body2"
                      sx={{ color: "green", display: "inline" }}>
                      {"Total Members :- " + group.members.length}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </Link>
          );
        })}
      </List>
    </>
  );
};

export default GroupList;
