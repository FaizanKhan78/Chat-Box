import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextField } from "@mui/material";
import useAsyncMutation from "./../../hooks/useAsyncMutation";
import { useUpdateBioMutation } from "../../redux/api/api";

export default function SelectSmall({ userName }) {
  const [status, setStatus] = React.useState("");
  const [custom, setCustom] = React.useState("");
  const statusValue = ["Chat Only", "Available", "Busy"];

  const [updateBio] = useAsyncMutation(useUpdateBioMutation);

  const handleChange = async (event) => {
    await updateBio("Update Bio of ", userName, { bio: event.target.value });
  };

  const handleCustom = async (e) => {
    if (e.key === "Enter") {
      // Perform the update action
      await updateBio("Update Bio of ", userName, { bio: e.target.value });

      // Clear the custom input field
      setCustom("");

      // Close the dropdown menu by resetting the status value to an empty string
      setStatus("");
    }
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120, width: 240 }} size="small">
      <InputLabel id="demo-select-small-label">Bio</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={status}
        label="Status"
        onChange={handleChange}>
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {statusValue.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
        <MenuItem value={"custom"}>
          <TextField
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleCustom}
            placeholder="Add Status..."
          />
        </MenuItem>
      </Select>
    </FormControl>
  );
}
