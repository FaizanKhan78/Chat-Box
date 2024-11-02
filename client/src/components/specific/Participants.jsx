import {
  Menu,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Fade,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsParticipants } from "../../redux/reducers/misc";

const Participants = ({ anchorEl }) => {
  const dispatch = useDispatch();
  const { isParticipants } = useSelector((state) => state.misc);
  const { members } = useSelector((state) => state.friendProfile);

  const handleClose = () => {
    dispatch(setIsParticipants(false));
  };

  const sortedMembers = [...members].sort((a, b) => b.creator - a.creator);

  return (
    <Menu
      anchorEl={anchorEl}
      open={isParticipants}
      onClose={handleClose}
      PaperProps={{
        width: "400px",
        maxHeight: "500px",
        overflowY: "auto",
        padding: 2,
      }}
      TransitionComponent={Fade}>
      <List sx={{ width: "100%", maxWidth: 360 }}>
        {sortedMembers.map((member, index) => (
          <ListItem
            key={index}
            sx={{
              borderRadius: "8px",
              marginBottom: "8px",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              },
            }}>
            <ListItemAvatar>
              <Avatar src={member.avatar} alt={member.name} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {member.name.slice(0, 8)}...
                  </Typography>
                  {member.groupAdmin && (
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: "green",
                        color: "white",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        marginLeft: 1,
                      }}>
                      Admin
                    </Typography>
                  )}
                  {member.creator && (
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: "blue",
                        color: "white",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        marginLeft: 1,
                      }}>
                      Creator
                    </Typography>
                  )}
                </Box>
              }
              secondary={
                <Typography variant="body2" color="textSecondary">
                  @{member.username}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Menu>
  );
};

export default Participants;
