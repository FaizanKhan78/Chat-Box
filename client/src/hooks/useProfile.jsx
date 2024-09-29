import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  clearAuthenticatedUser,
  setAuthenticatedUser,
} from "../redux/reducers/auth";
import { server } from "../constants/config";

const useProfile = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(server + "/api/v1/user/profile", { withCredentials: true })
      .then(({ data }) => {
        dispatch(setAuthenticatedUser(data));
      })
      .catch(() => {
        dispatch(clearAuthenticatedUser());
      });
  }, [dispatch]); // Add dispatch as a dependency to avoid re-rendering issues
};

export default useProfile;
