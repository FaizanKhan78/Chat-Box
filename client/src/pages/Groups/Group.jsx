import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  useGetChatDetailsQuery,
  useGetMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../../redux/api/api";
import { setIsAddMember } from "../../redux/reducers/misc";
import useAsyncMutation from "./../../hooks/useAsyncMutation";
import useErrors from "./../../hooks/useErrors";
import EditGroup from "./EditGroup";
import GroupList from "./GroupList";
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

  const errors = [
    { isError, error },
    { isError: groupDetails?.isError, error: groupDetails?.error },
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

  return (
    <>
      <Grid container>
        <Grid item xs={3}>
          <GroupList groups={data?.groups} />
        </Grid>
        <Grid item xs={9} sx={{ height: "100vh" }}>
          <EditGroup
            groupDetails={groupDetails?.data?.chat}
            groupName={groupName}
            handleGroupName={handleGroupName}
            members={members}
            groupAdmins={groupAdmins}
            handleUpdateGroupName={handleUpdateGroupName}
            isLoadingGroupName={isLoadingGroupName}
            handleRemoveMember={handleRemoveMember}
            openAddMemberModal={openAddMemberModal}
            chatId={chatId}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Group;
