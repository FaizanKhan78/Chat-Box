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
  Typography,
} from "@mui/material";
import { useGetGroupChatDetailsQuery } from "../../../redux/api/api";

const GroupDetailModal = ({ modal, handleClose, chatId }) => {
  const { data } = useGetGroupChatDetailsQuery({ chatId }, { skip: !chatId });
  const groupDetails = data?.chatDetails;

  if (!groupDetails) {
    return;
  }

  return (
    <Dialog open={modal} onClose={handleClose}>
      <DialogContent
        sx={{
          width: { xs: "300px", sm: "500px" },
          backgroundColor: "#1c1c1d",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
        }}>
        <DialogTitle
          align="center"
          sx={{
            fontWeight: "bold",
            color: "#fff",
            fontSize: "1.5rem",
          }}>
          {groupDetails.name} Details
        </DialogTitle>
        <Divider sx={{ backgroundColor: "#333", my: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}>
          {/* Group Avatar */}
          <Avatar
            src={groupDetails.avatar.url}
            alt={groupDetails.name}
            sx={{ width: 80, height: 80, mb: 2 }}
          />
          {/* Group Metadata */}
          <Typography sx={{ color: "#d1d1d1", mb: 1 }}>
            <strong>Created At: </strong>
            {new Date(groupDetails.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        {/* Group Admin Section */}
        <Typography sx={{ color: "#fff", mt: 3, fontWeight: "bold" }}>
          Group Admins
        </Typography>
        <List>
          {groupDetails.groupAdmin.map((admin) => (
            <ListItem key={admin._id}>
              <ListItemAvatar>
                <Avatar src={admin.avatar.url} alt={admin.name} />
              </ListItemAvatar>
              <ListItemText
                primary={admin.name}
                secondary={`Username: ${admin.username}`}
                sx={{ color: "#d1d1d1" }}
              />
            </ListItem>
          ))}
        </List>

        {/* Group Members Section */}
        <Typography sx={{ color: "#fff", mt: 3, fontWeight: "bold" }}>
          Group Members
        </Typography>
        <List>
          {groupDetails.members.map((member) => (
            <ListItem key={member._id}>
              <ListItemAvatar>
                <Avatar src={member.avatar.url} alt={member.name} />
              </ListItemAvatar>
              <ListItemText
                primary={member.name}
                secondary={`Username: ${member.username}`}
                sx={{ color: "#d1d1d1" }}
              />
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography sx={{ color: "#d1d1d1" }}>
            Group created by <strong>{groupDetails.groupAdmin[0].name}</strong>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetailModal;
