import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Chip,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { setIsMobile } from "../../redux/reducers/misc";

const Header = () => {
  const dispatch = useDispatch();

  const { isMobile } = useSelector((state) => state.misc);
  const friend = useSelector((state) => state.friendProfile);

  const handleMobile = () => {
    console.log("Mobile handle");
    dispatch(setIsMobile(!isMobile));
  };

  const location = useLocation();
  const { chatID } = useParams(); // Get the dynamic id from the URL

  const handleSearch = () => {
    console.log("Hello");
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleSearch}>
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary={"Search"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Grid container sx={{ padding: "1rem", alignItems: "center" }}>
        <Grid
          item
          sm={3}
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
            borderBottom: "1px solid rgba(223, 223, 223, 1)",
            paddingBottom: "1rem",
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginLeft: "20px",
              cursor: "pointer",
              "&:active": {
                scale: "0.9",
              },
              transition: "all .1s ease-in-out",
            }}>
            <Paper
              sx={{
                backgroundColor: "rgba(223, 223, 223, 0.2)",
                color: "text.primary",
                width: "fit-content",
                padding: ".5rem",
                letterSpacing: 1,
                placeItems: "center",
                display: "flex",
                borderRadius: "25%",
                "&:active": {
                  backgroundColor: "rgba(223, 223, 223, 0.6)", // Change background color on click
                },
              }}>
              <ArrowBackIosRoundedIcon fontSize=".3rem" />
            </Paper>
            <Typography
              sx={{
                fontSize: "1.3rem",
                letterSpacing: 1,
                color: "text.primary",
              }}>
              Chats
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6} sm={9} md={6}>
          <Box
            sx={{
              display: { xs: "block", sm: "none" },
            }}>
            <Button onClick={handleMobile}>
              <Paper
                sx={{
                  backgroundColor: "rgba(223, 223, 223, 0.2)",
                  color: "text.primary",
                  width: "fit-content",
                  padding: ".5rem",
                  letterSpacing: 1,
                  placeItems: "center",
                  display: "flex",
                  borderRadius: "25%",
                  "&:active": {
                    backgroundColor: "rgba(223, 223, 223, 0.6)", // Change background color on click
                  },
                }}>
                <MenuIcon />
              </Paper>
            </Button>
            <Drawer open={isMobile} onClose={handleMobile}>
              {DrawerList}
            </Drawer>
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Typography variant="h4" sx={{ color: "text.primary" }}>
              {location.pathname === "/setting" && "Settings"}
              {friend.groupChat && `${friend?.name} Group Chat`}
              {chatID && !friend.groupChat && `${friend?.name} Chat`}
            </Typography>
            {!(location.pathname === "/setting") && friend?.groupChat && (
              <Box>
                <Tooltip title="Participants">
                  <Chip
                    label="Participants"
                    variant="outlined"
                    sx={{ cursor: "pointer", borderColor: "text.primary" }}
                  />
                </Tooltip>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid
          item
          sx={{
            display: {
              xs: "none",
              md: !(location.pathname === "/setting") && "block",
            },
            borderBottom: "1px solid rgba(223, 223, 223, 1)",
            paddingBottom: "1rem",
            flexGrow: 1,
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginLeft: "20px",
              cursor: "pointer",
              "&:active": {
                scale: "0.9",
              },
              transition: "all .1s ease-in-out",
            }}>
            <Paper
              sx={{
                backgroundColor: "rgba(223, 223, 223, 0.2)",
                color: "text.primary",
                width: "fit-content",
                padding: ".5rem",
                letterSpacing: 1,
                placeItems: "center",
                display: "flex",
                borderRadius: "25%",
                "&:active": {
                  backgroundColor: "rgba(223, 223, 223, 0.6)", // Change background color on click
                },
              }}>
              <ArrowForwardIosRoundedIcon fontSize=".3rem" />
            </Paper>
            <Typography
              sx={{
                fontSize: "1.3rem",
                letterSpacing: 1,
                color: "text.primary",
              }}>
              Shared File
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={6}
          sx={{
            display: { xs: "flex", sm: "none" },
            justifyContent: "end",
            alignItems: "center",
          }}>
          <Box
            component="img"
            src="/logo3.png"
            alt="Logo"
            sx={{
              width: { xs: "60px", md: "60px" },
              height: { xs: "50px", md: "50px" },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Header;
