import {
  faRightFromBracket,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ForumIcon from "@mui/icons-material/Forum";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import {
  colors,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { flushSync } from "react-dom";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { adminLogout } from "../../redux/thunks/admin";

const AdminSideBar = ({ width = "100vw" }) => {
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const adminTabs = [
    {
      name: "Dashboard",
      path: "dashboard",
      icon: <SpaceDashboardIcon />,
    },
    {
      name: "User",
      path: "user",
      icon: <ManageAccountsIcon />,
    },
    {
      name: "Groups",
      path: "groups",
      icon: <FontAwesomeIcon icon={faUserGroup} />,
    },
    {
      name: "Messages",
      path: "messages",
      icon: <ForumIcon />,
    },
  ];

  const navigate = useNavigate();

  const handleNavigate = (link) => {
    if (document.startViewTransition()) {
      document.startViewTransition(() => {
        flushSync(() => {
          navigate(`/admin/${link}`);
        });
      });
    } else navigate(`/${link}`);
  };

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(adminLogout());
  };

  return (
    <Stack
      width={width}
      direction={"column"}
      p={isSmallScreen ? "1rem" : "2rem"}
      spacing={"2rem"}
      sx={{
        backgroundColor: "background",
        height: "100%",
        color: "text.primary",
      }}>
      <Typography variant="h5" color="primary.main">
        Chat Box
      </Typography>
      <Divider sx={{ backgroundColor: colors.grey[800] }} />
      <Stack spacing={"1rem"}>
        {adminTabs.map((tabs, index) => {
          const isActive = location.pathname.includes(tabs.path);
          return (
            <Link
              key={index}
              onClick={() => handleNavigate(tabs.path)}
              style={{
                textDecoration: "none",
              }}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={"1rem"}
                padding={".75rem"}
                sx={{
                  width: { xs: "100%", md: "calc(100vw - 79vw)" },
                  backgroundColor: isActive ? colors.grey[900] : "inherit",
                  borderRadius: "50px",
                  transition: "background-color 0.3s ease, transform 0.2s",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? colors.grey[300]
                        : colors.grey[700],
                    borderRadius: "50px",
                    transform: "scale(1.05)",
                  },
                }}>
                <IconButton
                  sx={{
                    color: isActive ? "primary.main" : "text.primary",
                    fontSize: "1.6rem",
                  }}
                  aria-label={tabs.name}>
                  {tabs.icon}
                </IconButton>
                <Typography
                  sx={{
                    color: isActive ? "primary.main" : "text.primary",
                    fontSize: "1.4rem",
                    fontWeight: isActive ? "bold" : "normal",
                  }}>
                  {tabs.name}
                </Typography>
              </Stack>
            </Link>
          );
        })}
        <Link
          to={"/setting"}
          onClick={handleLogout}
          style={{
            textDecoration: "none",
          }}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={"1rem"}
            padding={".75rem"}
            sx={{
              width: { xs: "100%", md: "calc(100vw - 79vw)" },
              borderRadius: "50px",
              transition: "background-color 0.3s ease, transform 0.2s",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light"
                    ? colors.grey[300]
                    : colors.grey[700],
                borderRadius: "50px",
                transform: "scale(1.05)",
              },
            }}>
            <IconButton
              sx={{
                fontSize: "1.6rem",
              }}
              aria-label="Logout">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </IconButton>
            <Typography
              sx={{
                fontSize: "1.4rem",
                color: "text.primary",
              }}>
              Exit
            </Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

export default AdminSideBar;
