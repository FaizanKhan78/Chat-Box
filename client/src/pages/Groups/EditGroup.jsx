import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotSelected from "../../components/shared/NotSelected";
import ConfirmDelete from "../../components/specific/ConfirmDelete";
import { VisuallyHiddenInput } from "../../components/styles/StyledComponents";
import useAsyncMutation from "../../hooks/useAsyncMutation";
import { useDeleteOrRenameGroupAvatarMutation } from "../../redux/api/api";
import {
  setIsAddGroupMember,
  setIsDeleteDialog,
} from "../../redux/reducers/misc";
import AddAdminModal from "./AddAdminModal";
import AddMemberModal from "./AddMemberModal";
const EditGroup = ({
  groupDetails,
  openAddMemberModal,
  handleRemoveAdmin,
  handleRemoveMember,
  handleGroupName,
  groupName,
  members,
  groupAdmins,
  handleUpdateGroupName,
  isLoadingGroupName,
  chatId,
  isLoadingRemoveMember,
  deleteGroup,
  setGroupAdmins,
  setGroupName,
  setMembers,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(undefined);

  const [avatarPreview, setAvatarPreview] = useState();

  const openAddGroupAdminModal = () => {
    dispatch(setIsAddGroupMember(true));
  };

  const handleDeleteGroup = () => {
    deleteGroup("Deleting Group ...", groupName, chatId);
    navigate(`/group`);
    dispatch(setIsDeleteDialog(false));
    setGroupName("");
    setMembers([]);
    setGroupAdmins([]);
  };

  const inputRef = useRef(null);

  const { isAddMember, isAddGroupAdmin } = useSelector((state) => state.misc);

  // Focus the TextField when the component renders
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    if (groupDetails) {
      setAvatarPreview(groupDetails.avatar.url);
    }
    if (avatar) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(avatar);
    }
  }, [avatar, groupDetails]);

  const avatarHandler = (event) => {
    setAvatar(event.target.files[0]);
  };

  const openDeleteModal = () => {
    dispatch(setIsDeleteDialog(true));
  };

  const [deleteOrUpdateAvatar] = useAsyncMutation(
    useDeleteOrRenameGroupAvatarMutation
  );
  const handleImageUpload = async (event, isDelete) => {
    console.log(isDelete);
    try {
      if (isDelete) {
        // Call the API to delete the avatar
        await deleteOrUpdateAvatar(
          `Deleting avatar of Group `,
          groupDetails.name,
          {
            chatId: groupDetails._id,
            public_id: groupDetails.avatar.public_id,
            isDelete,
          }
        );
      } else {
        // Prepare FormData for avatar update
        const group = new FormData();
        group.append("avatar", avatar);
        group.append("chatId", groupDetails._id);
        group.append("public_id", groupDetails.avatar.public_id);

        // Call the API to update the avatar
        await deleteOrUpdateAvatar(
          `Updating avatar of Group `,
          groupDetails.name,
          group
        );
      }
    } catch (error) {
      console.error("Error handling image upload:", error);
      // Optionally, add a user notification here
    }
  };

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
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    ":hover": {
                      transform: "scale(1.1)",
                      boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                    },
                  }}
                  src={avatarPreview}
                  alt={groupDetails?.name}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    bgcolor: "rgba(0,0,0,0.6)",
                    p: "6px",
                    borderRadius: "50%",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    transition: "background-color 0.3s ease",
                    ":hover": {
                      bgcolor: "rgba(0,0,0,0.8)",
                    },
                    color: "white",
                  }}
                  component="label">
                  <CameraAltIcon />
                  <VisuallyHiddenInput type="file" onChange={avatarHandler} />
                </IconButton>
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  gap: 2,
                }}>
                <Button
                  onClick={handleImageUpload}
                  color="primary"
                  variant="outlined"
                  sx={{
                    borderRadius: "24px",
                    padding: "8px 16px",
                    textTransform: "none",
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease",
                    ":hover": {
                      backgroundColor: "#1976d2",
                      color: "white",
                    },
                  }}>
                  <CloudUploadIcon sx={{ mr: 1 }} />
                  Upload
                </Button>
                <Button
                  onClick={() => handleImageUpload("_", true)}
                  color="error"
                  sx={{
                    borderRadius: "24px",
                    padding: "8px 16px",
                    textTransform: "none",
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease",
                    ":hover": {
                      backgroundColor: "#d32f2f",
                      color: "white",
                    },
                  }}>
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ marginRight: "8px" }}
                  />
                  Delete
                </Button>
              </Box>
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
          <Grid container sx={{ gap: "20px" }}>
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
                  <Typography>{admin.name.slice(0.6)}...</Typography>
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
          </Grid>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
            onClick={openAddGroupAdminModal}>
            Add Group Admin
          </Button>

          {/* Divider */}
          <Divider sx={{ my: 4 }} />

          {/* Members Section with Color Outline and Hover Effect */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            <Chip label="Members :" color="warning" />{" "}
          </Typography>
          <Grid container sx={{ gap: "20px" }}>
            {isLoadingRemoveMember ? (
              <>
                <Backdrop
                  sx={(theme) => ({
                    color: "#fff",
                    zIndex: theme.zIndex.drawer + 1,
                  })}
                  open={open}>
                  <CircularProgress />
                </Backdrop>
              </>
            ) : (
              <>
                {members?.map((member) => (
                  <Box
                    key={member._id}
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
                      <Typography>{member.name.slice(0, 6)}...</Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveMember(member._id)}>
                        Remove
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </>
            )}
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
            <Button variant="contained" color="error" onClick={openDeleteModal}>
              Delete Group
            </Button>
          </Box>
        </Container>
        {isAddMember && (
          <AddMemberModal chatId={chatId} groupName={groupName} />
        )}
        <AddAdminModal
          groupAdmins={groupAdmins}
          chatId={chatId}
          groupName={groupName}
          members={members}
          setGroupAdmins={setGroupAdmins}
        />
        <ConfirmDelete
          handleDeleteGroup={handleDeleteGroup}
          groupName={groupName}
        />
      </>
    );
  }
};

export default EditGroup;
