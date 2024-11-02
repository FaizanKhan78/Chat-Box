import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

const GroupList = ({ groups }) => {
  const [isGroupList, setIsGroupList] = useState(false);

  const handleGroupList = () => {
    setIsGroupList(!isGroupList);
  };
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/");
  };

  const DrawerList = (
    <List
      sx={{
        width: 250,
        padding: "1rem",
        bgcolor: "background.default",
        height: "100%",
      }}>
      {groups?.map((group, i) => (
        <Link
          key={i}
          to={`?group=${group._id}`}
          onClick={handleGroupList}
          style={{
            textDecoration: "none",
            color: "inherit", // Inherit color from parent
          }}>
          <ListItem
            alignItems="flex-start"
            sx={{
              ":hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}>
            <ListItemAvatar>
              <Avatar
                alt={group.name}
                src={group.avatar || "/default-avatar.png"}
                sx={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                }}>
                {!group.avatar && group?.name?.slice(0, 2)?.toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={group.name}
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: "green", display: "inline" }}>
                  {"Total Members: " + group.members.length}
                </Typography>
              }
              sx={{
                color: "text.primary",
                paddingLeft: "10px",
              }}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </Link>
      ))}
    </List>
  );

  return (
    <>
      <Typography
        component="div"
        sx={{
          fontSize: "28px",
          padding: "10px",
          display: { md: "flex", xs: "none" },
          justifyContent: "space-around",
          alignItems: "center",
          color: "text.primary",
        }}>
        <Box
          sx={{
            backgroundColor: "#484a48",
            padding: "13px 13px",
            borderRadius: "50px",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            ":hover": {
              backgroundColor: "#7f7f7f",
            },
          }}
          onClick={handleNavigate}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Box>
        <span style={{ marginLeft: "10px" }}>My Groups</span>
      </Typography>

      <Box
        sx={{
          padding: "20px",
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}>
        <IconButton>
          <FontAwesomeIcon icon={faArrowLeft} onClick={handleNavigate} />
        </IconButton>
        <Button onClick={handleGroupList}>
          <Paper
            sx={{
              bgcolor: "rgba(223, 223, 223, 0.2)",
              color: "text.primary",
              padding: "0.5rem",
              display: "flex",
              borderRadius: "50%",
              "&:hover": { bgcolor: "rgba(223, 223, 223, 0.4)" },
            }}>
            <MenuIcon />
          </Paper>
        </Button>
        <Drawer open={isGroupList} onClose={handleGroupList}>
          {DrawerList}
        </Drawer>
      </Box>

      <List
        sx={{
          width: { xs: "0%", md: "100%" },
          display: { xs: "none", md: "block" },
          bgcolor: "background.default",
          borderRadius: "8px",
          boxShadow: 1,
          padding: "1rem",
        }}>
        {groups?.map((group, i) => (
          <Link
            key={i}
            to={`?group=${group._id}`}
            style={{
              textDecoration: "none",
              color: "inherit", // Inherit color from parent
            }}>
            <ListItem
              alignItems="flex-start"
              sx={{
                ":hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}>
              <ListItemAvatar>
                <Avatar
                  alt={group.name}
                  src={group.avatar || "/default-avatar.png"}
                  sx={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                  }}>
                  {!group.avatar && group?.name?.slice(0, 2)?.toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={group.name}
                secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "green", display: "inline" }}>
                    {"Total Members: " + group.members.length}
                  </Typography>
                }
                sx={{
                  color: "text.primary",
                  paddingLeft: "10px",
                }}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </Link>
        ))}
      </List>
    </>
  );
};

export default GroupList;
