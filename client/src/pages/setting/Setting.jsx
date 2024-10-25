import { useTheme } from "@emotion/react";
import { faPeopleGroup, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PersonalDetails from "../../components/specific/PersonalDetails";
import { VisuallyHiddenInput } from "../../components/styles/StyledComponents";
import { getToastConfig } from "../../lib/features";
import { clearAuthenticatedUser } from "../../redux/reducers/auth";
import { getAdmin } from "../../redux/thunks/admin";
import AdminModal from "../admin/AdminModal";
import { server } from "./../../constants/config";

// Reusable toast configuration

const Setting = () => {
  const { user, isAdmin, adminAccess } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(clearAuthenticatedUser());
      toast.success(data.message, getToastConfig(theme));
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "An error occurred",
        getToastConfig(theme)
      );
    }
  };

  const navigateHandler = () => {
    if (document.startViewTransition()) {
      document.startViewTransition(() => {
        flushSync(() => {
          navigate("/admin");
        });
      });
    } else navigate("/admin");
  };

  const handleIsAdminModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, []);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}>
      {/* Main Content */}
      <Grid container alignItems={"center"}>
        <Grid item xs={3}>
          <Avatar
            src={user?.avatar?.url}
            sx={{
              width: "200px",
              height: "200px",
            }}
          />
        </Grid>

        <Grid item xs={8}>
          <Button
            component="label"
            variant="outlined"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{
              color: "text.secondary",
              borderRadius: "15px",
              marginBottom: "15px",
            }}>
            Upload file
            <VisuallyHiddenInput type="file" />
          </Button>

          <Typography sx={{ color: "gray" }}>
            At least 800 x 800 is recommended.
            <br />
            JPG or PNG is allowed
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ marginTop: "20px" }} />

      <PersonalDetails user={user} />

      <Box
        component={"div"}
        sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          {isAdmin && (
            <>
              {!adminAccess ? (
                <Button
                  variant="outlined"
                  component="label"
                  color="primary"
                  sx={{ fontWeight: "550", marginBottom: "20px" }}
                  onClick={handleIsAdminModal}>
                  <Link
                    component="button"
                    underline="none"
                    style={{ color: "#c800ff", textDecoration: "none" }}>
                    Admin Panel
                  </Link>
                </Button>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  color="primary"
                  sx={{ fontWeight: "550", marginBottom: "20px" }}
                  onClick={navigateHandler}>
                  <Link
                    to="/admin"
                    underline="none"
                    style={{ color: "#c800ff", textDecoration: "none" }}>
                    Go To Panel
                  </Link>
                </Button>
              )}
            </>
          )}
        </Box>

        <Box item>
          <Tooltip title="logout">
            <Button
              component="label"
              variant="outlined"
              color="primary"
              sx={{ fontWeight: "550", marginBottom: "20px" }}
              startIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
              onClick={handleLogout}>
              Logout
            </Button>
          </Tooltip>
        </Box>
        <Box item>
          <Link to="/group">
            <Tooltip title="My Groups">
              <Button
                component="label"
                variant="outlined"
                color="primary"
                sx={{ fontWeight: "550", marginBottom: "20px" }}
                startIcon={<FontAwesomeIcon icon={faPeopleGroup} />}>
                My Groups
              </Button>
            </Tooltip>
          </Link>
        </Box>
      </Box>
      <AdminModal modal={modal} handleClose={handleIsAdminModal} />
    </Container>
  );
};

export default Setting;
