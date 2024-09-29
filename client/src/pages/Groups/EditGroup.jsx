import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef } from "react";
import NotSelected from "../../components/shared/NotSelected";
import { VisuallyHiddenInput } from "../../components/styles/StyledComponents";
import AddMemberModal from "./AddMemberModal";
import { useSelector } from "react-redux";

const EditGroup = ({
  groupDetails,
  handleAddAdmin,
  openAddMemberModal,
  handleRemoveAdmin,
  handleRemoveMember,
  handleDeleteGroup,
  handleGroupName,
  groupName,
  members,
  groupAdmins,
  handleUpdateGroupName,
  isLoadingGroupName,
  chatId,
}) => {
  const inputRef = useRef(null);

  const { isAddMember } = useSelector((state) => state.misc);

  // Focus the TextField when the component renders
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  if (!groupDetails) {
    return (
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: "100vh",
        }}>
        <NotSelected message={"No Group Selected"} />
      </Container>
    );
  } else {
    return (
      <>
        <Container sx={{ padding: "30px" }}>
          <Grid
            container
            spacing={4}
            sx={{ alignItems: "center", justifyContent: "space-between" }}>
            {/* Group Avatar and Edit Icon */}
            <Grid item>
              <Stack position="relative" width="7rem" margin="auto">
                <Avatar
                  sx={{
                    width: "100%",
                    height: "7rem",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                    ":hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                  src={groupDetails?.avatar}
                  alt={groupDetails?.name}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "rgba(0,0,0,0.5)",
                    ":hover": {
                      bgcolor: "rgba(0,0,0,0.7)",
                    },
                    color: "white",
                  }}
                  component="label">
                  <CameraAltIcon />
                  <VisuallyHiddenInput type="file" />
                </IconButton>
              </Stack>
            </Grid>

            <Grid item>
              <Box sx={{ "& > :not(style)": { m: 1 }, display: "flex" }}>
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <GroupsIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                  <TextField
                    value={groupName}
                    onChange={handleGroupName}
                    id="group-name-input"
                    label="Group Name"
                    variant="standard"
                    inputRef={inputRef}
                  />
                </Box>
                <Button
                  variant="outlined"
                  onClick={handleUpdateGroupName}
                  disabled={isLoadingGroupName}>
                  Submit
                </Button>
              </Box>
            </Grid>
            <Grid item>
              {/* Creator Section with Color Outline and Hover Effect */}
              <Box
                mt={2}
                sx={{
                  border: "2px solid #1976d2",
                  borderRadius: "8px",
                  p: 2,
                  width: "200px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  transition: "background-color 0.3s ease",
                  ":hover": {
                    backgroundColor: "background.paper",
                  },
                }}>
                <Chip
                  label="Creator"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                />
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      transition: "transform 0.3s ease",
                      ":hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                    src={groupDetails?.creator?.avatar}
                    alt={groupDetails?.creator?.name}
                  />
                  <Typography>{groupDetails?.creator?.name}</Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          {/* Divider */}
          <Divider sx={{ my: 4 }} />

          {/* Group Admin Section with Color Outline and Hover Effect */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            <Chip label="Group Admin :" color="success" />
          </Typography>
          <Stack direction="row" spacing={2}>
            {groupAdmins?.map((admin) => (
              <Box
                key={admin._id}
                sx={{
                  border: "2px solid #2e7d32",
                  borderRadius: "8px",
                  p: 2,
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  ":hover": {
                    backgroundColor: "background.paper",
                  },
                }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      transition: "transform 0.3s ease",
                      ":hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                    src={admin.avatar}
                    alt={admin.name}
                  />
                  <Typography>{admin.name}</Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveAdmin(admin._id)}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
            onClick={handleAddAdmin}>
            Add Group Admin
          </Button>

          {/* Divider */}
          <Divider sx={{ my: 4 }} />

          {/* Members Section with Color Outline and Hover Effect */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            <Chip label="Members :" color="warning" />{" "}
          </Typography>
          <Grid container spacing={3}>
            {members?.map((member) => (
              <Grid item xs={6} sm={4} md={3} key={member._id}>
                <Box
                  sx={{
                    border: "2px solid #fbc02d",
                    borderRadius: "8px",
                    p: 2,
                    transition: "background-color 0.3s ease",
                    ":hover": {
                      cursor: "pointer",
                      backgroundColor: "background.paper",
                    },
                  }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{
                        transition: "transform 0.3s ease",
                        ":hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                      src={member.avatar}
                      alt={member.name}
                    />
                    <Typography>{member.name}</Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleRemoveMember(member._id)}>
                      Remove
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
            onClick={openAddMemberModal}>
            Add Member
          </Button>

          {/* Delete Group Button */}
          <Box
            sx={{
              mt: 4,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteGroup}>
              Delete Group
            </Button>
          </Box>
        </Container>
        {isAddMember && (
          <AddMemberModal chatId={chatId} groupName={groupName} />
        )}
      </>
    );
  }
};

export default EditGroup;
