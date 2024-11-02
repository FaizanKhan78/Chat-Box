import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useDeleteChatMutation,
  useGetChatDetailsQuery,
  useGetMyGroupsQuery,
  useRemoveGroupAdminMutation,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../../redux/api/api";
import { setIsAddMember } from "../../redux/reducers/misc";
import useAsyncMutation from "./../../hooks/useAsyncMutation";
import useErrors from "./../../hooks/useErrors";
import EditGroup from "./EditGroup";
import GroupList from "./GroupList";
import { KeyboardArrowRight } from "@mui/icons-material";
import { flushSync } from "react-dom";
const Group = () => {
  const { data, isError, error } = useGetMyGroupsQuery("");
  const location = useLocation();

  // Create a URLSearchParams instance to parse the query parameters
  const queryParams = new URLSearchParams(location.search);

  // Get specific query parameters by name
  const chatId = queryParams.get("group"); // replace 'paramName' with your actual query parameter

  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [groupAdmins, setGroupAdmins] = useState([]);

  const dispatch = useDispatch();

  const handleGroupName = (e) => {
    setGroupName(e.target.value);
  };

  const groupDetails = useGetChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroupName, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );
  const [removeGroupMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );
  const [deleteGroup] = useAsyncMutation(useDeleteChatMutation);

  const [removeAdmin] = useAsyncMutation(useRemoveGroupAdminMutation);

  const errors = [
    { isError, error },
    { isError: groupDetails.isError, error: groupDetails.error },
  ];
  useErrors(errors);

  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails.data.chat.name);
      setMembers(groupDetails.data.chat.members);
      setGroupAdmins(groupDetails.data.chat.groupAdmin);
    }
    return () => {
      setGroupName("");
      setMembers([]);
      setGroupAdmins([]);
    };
  }, [groupDetails.data]);

  const handleUpdateGroupName = () => {
    updateGroupName("Updating Group Name...", groupName, {
      chatId,
      name: groupName,
    });
  };

  const handleRemoveMember = (id) => {
    removeGroupMember("Removing Member From Group", groupName, {
      chatId,
      userId: id,
    });
  };

  const openAddMemberModal = () => {
    dispatch(setIsAddMember(true));
  };
  const navigate = useNavigate();
  const handleNavigate = () => {
    if (document.startViewTransition()) {
      document.startViewTransition(() => {
        flushSync(() => {
          navigate("/setting");
        });
      });
    }
    navigate("/setting");
  };

  const handleRemoveAdmin = async (id) => {
    await removeAdmin("Remove A Group Admin from ", groupName, {
      chatId,
      userId: id,
    });
  };
  // * Add the Navigation to other Group when a Group is Deleted.
  // * handle The Conditions Like if the middle one is deleted then navigate to previous and if first one is deleted the navigate to 2 and if last one is deleted then navigate to previous one
  // useEffect(()=>{
  //   if(data?.groups){

  //   }
  // },[data?.groups])

  return (
    <>
      {data?.groups.length === 0 ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Typography
            sx={{
              fontSize: "40px",
              textAlign: "center",
              padding: "20px",
            }}>
            Your Are Not Group Admin of Any Group
          </Typography>
          <Button
            variant="outlined"
            endDecorator={<KeyboardArrowRight />}
            color="success"
            onClick={handleNavigate}>
            Go to Back
          </Button>{" "}
        </Box>
      ) : (
        <Grid container>
          <Grid item xs={0} md={3}>
            <GroupList groups={data?.groups} />
          </Grid>
          <Grid item xs={12} md={9} sx={{ height: "100vh" }}>
            <EditGroup
              groupDetails={groupDetails?.data?.chat}
              groupName={groupName}
              handleRemoveAdmin={handleRemoveAdmin}
              handleGroupName={handleGroupName}
              members={members}
              groupAdmins={groupAdmins}
              handleUpdateGroupName={handleUpdateGroupName}
              isLoadingGroupName={isLoadingGroupName}
              handleRemoveMember={handleRemoveMember}
              openAddMemberModal={openAddMemberModal}
              chatId={chatId}
              isLoadingRemoveMember={isLoadingRemoveMember}
              deleteGroup={deleteGroup}
              setGroupAdmins={setGroupAdmins}
              setMembers={setMembers}
              setGroupName={setGroupName}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Group;
