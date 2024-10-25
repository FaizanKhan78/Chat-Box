import { useFetchData } from "6pp";
import { useTheme } from "@emotion/react";
import {
  Avatar,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { server } from "./../../constants/config";
import useErrors from "../../hooks/useErrors";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleGroup, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import GroupDetailModal from "./specific/GroupDetailModal";
import toast from "react-hot-toast";
import { getToastConfig } from "../../lib/features";

const columns = [
  {
    id: "avatar",
    label: "Avatar/Name",
    minWidth: 170,
    align: "left",
  },
  {
    id: "creator",
    label: "Creator",
    minWidth: 100,
    align: "left",
  },
  {
    id: "groupChat",
    label: "Group Chat",
    minWidth: 100,
    align: "left",
  },
  {
    id: "members",
    label: "Members",
    minWidth: 100,
    align: "left",
  },
  {
    id: "totalMessages",
    label: "Total Messages",
    minWidth: 100,
    align: "left",
  },
];

const GroupManage = () => {
  // State
  const [page, setPage] = useState(0); // Change to 0-indexed for MUI Pagination
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [modal, setModal] = useState(false);
  const [chatId, setChatId] = useState();

  const handleCloseModal = () => {
    setModal(false);
    setChatId();
  };

  const theme = useTheme();

  const handleOpenModal = (id, groupChat) => {
    if (groupChat) {
      setModal(true);
      setChatId(id);
    } else {
      toast.error("Please Select Group Chat", getToastConfig(theme));
      return;
    }
  };

  const { data, error, loading } = useFetchData(
    `${server}/api/v1/admin/chats`,
    "chats-stats"
  );

  const paginateData = data?.chats?.slice(
    page * rowsPerPage, // Adjust for 0-indexed pagination
    (page + 1) * rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  useErrors([
    {
      isError: error,
      error,
    },
  ]);

  return loading ? (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{
                  minWidth: column.minWidth,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                }}>
                <Skeleton variant="text" width={100} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(11)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => {
                if (column.id === "avatar") {
                  return (
                    <TableCell key={column.id}>
                      <Skeleton variant="circular" width={40} height={40} />
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell key={column.id}>
                      <Skeleton variant="rectangular" height={30} />
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <>
      <TableContainer sx={{ maxHeight: "94vh" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((c) => {
                return (
                  <TableCell
                    key={c.id}
                    align={c.align}
                    style={{
                      minWidth: c.minWidth,
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      fontWeight: "bold",
                    }}>
                    {c.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginateData?.map((chat) => {
              let firstName = chat.name?.split("-")[0].charAt(0);
              // let secondName = chat.name?.split("-")[1].charAt(1);
              return (
                <TableRow
                  key={chat._id}
                  onClick={() => handleOpenModal(chat._id, chat.groupChat)}
                  hover>
                  <TableCell
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}>
                    {chat.avatar ? (
                      <Avatar src={chat.avatar} />
                    ) : (
                      <Avatar>SC</Avatar>
                    )}
                    <Typography sx={{ color: "gray" }}>{chat.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Avatar src={chat.creator.avatar} />
                    <Typography sx={{ color: "gray", marginTop: "10px" }}>
                      {chat.creator.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {chat.groupChat ? (
                      <Tooltip title="Group" placement="top" arrow>
                        <FontAwesomeIcon icon={faPeopleGroup} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Single" placement="top" arrow>
                        <FontAwesomeIcon icon={faUserGroup} />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>{chat.totalMembers}</TableCell>
                  <TableCell>{chat.totalMessages}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[7, 10, 25, 50, 100]} // Added rowsPerPageOptions
        count={data?.chats?.length} // Total row count, not the number of pages
        page={page} // Use 0-indexed pagination
        onPageChange={handleChangePage} // Correct onChange handler
        onRowsPerPageChange={handleRowsPerPage}
        rowsPerPage={rowsPerPage}
        showFirstButton
        showLastButton
      />
      <GroupDetailModal
        modal={modal}
        handleClose={handleCloseModal}
        chatId={chatId}
      />
    </>
  );
};

export default GroupManage;
