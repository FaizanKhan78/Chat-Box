import { useFetchData } from "6pp";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Backdrop,
  Box,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { toast } from "react-hot-toast";
import { dashBoardData } from "../../constants/sampleData";
import { transformImage } from "../../lib/features";
import { server } from "./../../constants/config";
import useErrors from "./../../hooks/useErrors";
import Skeleton from "./../Layout/Loaders/Skeleton";

const UserDetailsModal = React.lazy(() =>
  import("../../pages/admin/specific/UserDetailsModal")
);
const columns = [
  { id: "ID", label: "ID/Name", minWidth: 100 },
  {
    id: "avatar",
    label: "Avatar",
    minWidth: 170,
    align: "left",
  },
  {
    id: "friends",
    label: "Friends",
    minWidth: 100,
    align: "right",
  },
  {
    id: "groups",
    label: "Groups",
    minWidth: 100,
    align: "right",
  },
];

export default function DisplayTable() {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [userId, setUserId] = React.useState();
  const [filter, setFilter] = React.useState("");
  const [modal, setModal] = React.useState(false);
  const theme = useTheme();

  const { data, error, loading, refetch } = useFetchData(
    `${server}/api/v1/admin/users`,
    "users-stats"
  );

  React.useEffect(() => {
    refetch();
  }, []);

  useErrors([
    {
      isError: error,
      error,
    },
  ]);

  const { data: userData } = data || {};

  React.useEffect(() => {
    setRows(
      dashBoardData.users.map((i) => ({
        ...i,
        id: i._id,
        avatar: transformImage(i.avatar),
      }))
    );
  }, []);

  const handleSearch = (e) => {
    if (filter === "") {
      toast("Select Filter", {
        icon: "😠💢",
        style: {
          borderRadius: "10px",
          background: theme.palette.background.paper,
          color: theme.palette.mode === "dark" ? "white" : "black",
        },
      });
      return;
    }
    setPage(0);
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const filteredRows = userData?.filter((row) => {
    return filter
      ? row[filter].toString().toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  const handleModal = async (id) => {
    setModal(!modal);
    if (!modal) {
      setUserId(id);
    }
  };

  return loading ? (
    <>
      <Skeleton />
    </>
  ) : (
    <>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          height: "100vh",
        }}>
        <TableContainer
          sx={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            marginBottom: "20px",
          }}>
          <TextField
            sx={{
              width: "80%",
              borderRadius: "4px",
            }}
            placeholder="Search..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl
            variant="outlined"
            sx={{
              minWidth: 160,
              borderRadius: "4px",
            }}>
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              labelId="filter-label"
              id="filter-select"
              value={filter}
              onChange={handleFilter}
              label="Filter">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"name"}>Name</MenuItem>
              <MenuItem value={"friends"}>Friends</MenuItem>
              <MenuItem value={"groups"}>Groups</MenuItem>
            </Select>
          </FormControl>
        </TableContainer>

        <TableContainer sx={{ maxHeight: "80vh" }}>
          <Table stickyHeader aria-label="sticky table">
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
                      fontWeight: "bold",
                    }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row) => (
                  <Tooltip
                    onClick={() => handleModal(row._id)}
                    key={row._id}
                    title={row.name}
                    placement="top"
                    arrow
                    sx={{ cursor: "pointer" }}>
                    <TableRow hover tabIndex={-1} role="checkbox">
                      <TableCell
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}>
                        <Box>
                          <Typography>{row.name}</Typography>
                          <Typography sx={{ opacity: 0.5 }}>
                            {row.username}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Avatar
                          src={row.avatar}
                          alt={row.name}
                          sx={{ marginRight: "16px", width: 40, height: 40 }}
                        />
                      </TableCell>
                      <TableCell align="right">{row.friends}</TableCell>
                      <TableCell align="right">{row.groups}</TableCell>
                    </TableRow>
                  </Tooltip>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 75, 100]}
          count={filteredRows?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: "0px -2px 5px rgba(0,0,0,0.1)",
          }}
        />
      </Paper>
      <React.Suspense fallback={<Backdrop open />}>
        <UserDetailsModal
          modal={modal}
          handleModal={handleModal}
          userId={userId}
        />
      </React.Suspense>
    </>
  );
}
