import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import moment from "moment";
import { memo } from "react";
import { transformImage } from "../../lib/features";

const UserItem = ({ user, handler, isAdded }) => {
  const { name, username, _id, avatar, createdAt } = user;
  return (
    <>
      <ListItem alignItems="center">
        <ListItemAvatar>
          <Avatar alt={name} src={transformImage(avatar)} />
        </ListItemAvatar>

        <ListItemText
          primary={
            <>
              <Typography
                component="span"
                variant="body1"
                sx={{ fontWeight: "bold", marginRight: 1 }}>
                {name}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                color="text.secondary">
                @{username}
              </Typography>
            </>
          }
          secondary={
            <Typography component="span" variant="body2" color="text.secondary">
              Joined: {moment(createdAt).fromNow()}
            </Typography>
          }
        />

        <IconButton
          onClick={() => handler(_id, name)}
          sx={{
            backgroundColor: isAdded ? "red" : "#31aa84",
            color: "white",
            "&:hover": {
              backgroundColor: isAdded ? "#b30000" : "#248f6a",
            },
          }}>
          <FontAwesomeIcon icon={isAdded ? faX : faPlus} fontSize={15} />
        </IconButton>
      </ListItem>

      <Divider variant="inset" component="li" />
    </>
  );
};

export default memo(UserItem);
