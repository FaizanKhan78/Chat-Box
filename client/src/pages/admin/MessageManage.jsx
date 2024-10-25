import { useFetchData } from "6pp";
import { useTheme } from "@emotion/react";
import { faPeopleGroup, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import useErrors from "../../hooks/useErrors";
import { server } from "./../../constants/config";

const columns = [
  { id: "sendBy", label: "Send By", align: "left", minWidth: 100 },
  { id: "content", label: "Content", align: "left", minWidth: 100 },
  { id: "attachment", label: "Attachment", align: "center", minWidth: 170 },
  { id: "groupChat", label: "Group Chat", align: "left", minWidth: 100 },
  { id: "time", label: "Time", align: "left", minWidth: 100 },
  { id: "chatId", label: "Chat Id", align: "left", minWidth: 100 },
];

const MessageManage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(10);
  const { data, loading, error } = useFetchData(
    `${server}/api/v1/admin/messages`,
    "messages-stats"
  );
  const pageNate = data?.messages?.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
  const theme = useTheme();
  useErrors([
    {
      isError: error,
      error,
    },
  ]);

  const handlePageChange = (event, pageNum) => {
    setPage(pageNum);
  };

  const handleRowsPer = (event) => {
    setRowPerPage(event.target.value);
  };

  const handleCopyClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Chat Id Copied"))
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };
  return loading ? (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                return (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      fontWeight: "bold",
                    }}>
                    <Skeleton animation="wave" />
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(11)].map((col) => (
              <TableRow key={col}>
                <TableCell>
                  <Skeleton animation="wave" />
                </TableCell>
                <TableCell>
                  <Skeleton animation="wave" />
                </TableCell>
                <TableCell>
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    height={30}
                    width={30}
                  />
                </TableCell>
                <TableCell>
                  <Skeleton animation="wave" />
                </TableCell>
                <TableCell>
                  <Skeleton animation="wave" />
                </TableCell>
                <TableCell>
                  <Skeleton animation="wave" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  ) : (
    <>
      <TableContainer sx={{ maxHeight: "94vh" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => {
                return (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      fontWeight: "bold",
                    }}>
                    {column.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageNate?.map((message) => {
              return (
                <TableRow key={message._id} hover>
                  <TableCell>
                    <Avatar src={message.sender.avatar} />
                    <Typography sx={{ marginTop: "5px", color: "grey" }}>
                      {message.sender.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{message.content}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box align="center">
                      {message.attachment ? (
                        message.attachment?.split(".").pop() === "mp4" ? (
                          <Box
                            component="div"
                            sx={{
                              position: "relative",
                              width: "200px",
                              height: "200px",
                              borderRadius: "20px",
                              overflow: "hidden", // Prevents any overflow beyond the box
                            }}>
                            <video
                              style={{
                                width: "100%", // Make the video fill the container width
                                height: "100%", // Ensure the video height fills the container
                                objectFit: "cover", // Maintain aspect ratio and cover the box
                                borderRadius: "20px", // Smooth corners
                              }}
                              controls
                              src={message.attachment}
                            />
                            <Typography
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                width: "100%",
                                textAlign: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent overlay for readability
                                color: "#fff", // White text for contrast
                                padding: "5px 0", // Add padding for text spacing
                                fontSize: "14px", // Adjust the font size to fit
                              }}>
                              Video
                            </Typography>
                          </Box>
                        ) : (
                          <Box
                            component="div"
                            sx={{
                              position: "relative",
                              width: "200px",
                              height: "200px",
                              borderRadius: "20px",
                              overflow: "hidden",
                            }}>
                            <img
                              style={{
                                width: "100%", // Make sure the image fills the box width
                                height: "100%", // Ensure the image height fills the box height
                                objectFit: "cover", // Maintain aspect ratio and cover the box
                                borderRadius: "20px", // Smooth corners
                              }}
                              src={message.attachment}
                              alt="attachment"
                            />
                            <Typography
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                width: "100%",
                                textAlign: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent background for readability
                                color: "#fff", // White text color for contrast
                                padding: "5px 0", // Padding to give some space
                                fontSize: "14px", // Adjust the font size
                              }}>
                              Image
                            </Typography>
                          </Box>
                        )
                      ) : (
                        "No Attachment"
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {message.groupChat ? (
                        <Tooltip title="Group" placement="top" arrow>
                          <FontAwesomeIcon icon={faPeopleGroup} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Single" placement="top" arrow>
                          <FontAwesomeIcon icon={faUserGroup} />
                        </Tooltip>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {moment(message.createdAt).format("MMMM-D-Y")}
                  </TableCell>
                  <TableCell onClick={() => handleCopyClipboard(message.chat)}>
                    {message.chat.slice(0, 8)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 75, 100]}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPer}
        showFirstButton
        showLastButton
        count={data?.messages?.length}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: "0px -2px 5px rgba(0,0,0,0.1)",
        }}
      />
    </>
  );
};

export default MessageManage;
