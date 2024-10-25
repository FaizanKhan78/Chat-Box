import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import useErrors from "../../../hooks/useErrors";
import { useGetUserDetailsQuery } from "../../../redux/api/api";

const UserDetailsModal = ({ modal, handleModal, userId }) => {
  const { data, isLoading, error } = useGetUserDetailsQuery(
    { userId },
    { skip: !userId } // This will skip the query if no userId is present
  );

  const userData = data?.data;

  useErrors([{ isError: error, error }]);

  if (isLoading)
    return (
      <div>
        <Skeleton />
      </div>
    );

  return (
    <Dialog open={modal} onClose={handleModal} fullWidth maxWidth="sm">
      <DialogContent
        sx={{
          backgroundColor: "#1c1c1d",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
        }}>
        {/* User Details Header */}
        <DialogTitle
          align="center"
          sx={{
            fontWeight: "bold",
            color: "#fff",
            mb: 2,
            fontSize: "1.5rem",
          }}>
          {userData?.name}&apos;s Profile
        </DialogTitle>
        <Divider sx={{ backgroundColor: "#333", mb: 2 }} />

        {/* User Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}>
          <Avatar
            src={userData?.avatar}
            alt={userData?.name}
            sx={{
              width: 100,
              height: 100,
              mb: 2,
              border: "2px solid #fff",
            }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#d1d1d1", mb: 1 }}>
              <strong>Username: </strong> {userData?.username}
            </Typography>
            <Typography sx={{ color: "gray", mb: 1 }}>
              <strong>Bio: </strong>
              {userData?.bio || "No Bio"}
            </Typography>
            <Typography sx={{ color: "#d1d1d1", mb: 1 }}>
              <strong>Email: </strong> {userData?.email}
            </Typography>
            <Typography sx={{ color: "#d1d1d1", mb: 1 }}>
              <strong>Mobile Number: </strong>
              {userData?.number !== 0 ? userData?.number : "No Mobile Number"}
            </Typography>
          </Box>
        </Box>

        {/* Friends List */}
        <Divider sx={{ backgroundColor: "#333", my: 3 }} />
        <Typography sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
          Friends
        </Typography>
        <List sx={{ maxHeight: 200, overflowY: "auto" }}>
          {userData?.friends?.length === 0 ? (
            <Typography fontSize={"2rem"}>No Friends</Typography>
          ) : (
            userData?.friends?.map(({ friend }) => (
              <ListItem key={friend._id}>
                <ListItemAvatar>
                  <Avatar src={friend.avatar.url} alt={friend.username} />
                </ListItemAvatar>
                <ListItemText
                  primary={friend.name}
                  secondary={`@${friend.username}`}
                  sx={{
                    color: "#fff",
                    "& .MuiListItemText-primary": { color: "#fff" },
                    "& .MuiListItemText-secondary": { color: "#aaa" },
                  }}
                />
              </ListItem>
            ))
          )}
        </List>

        {/* Groups List */}
        <Divider sx={{ backgroundColor: "#333", my: 3 }} />
        <Typography sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
          Groups
        </Typography>
        <List sx={{ maxHeight: 200, overflowY: "auto" }}>
          {userData?.groups?.length === 0 ? (
            <Typography fontSize={"2rem"}>Not in any Group</Typography>
          ) : (
            userData?.groups?.map((group) => (
              <ListItem key={group._id}>
                <ListItemAvatar>
                  <Avatar
                    src={group.creator.avatar.url}
                    alt={group.creator.name}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={group.name}
                  secondary={`Created by: ${group.creator.name}`}
                  sx={{
                    color: "#fff",
                    "& .MuiListItemText-primary": { color: "#fff" },
                    "& .MuiListItemText-secondary": { color: "#aaa" },
                  }}
                />
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
