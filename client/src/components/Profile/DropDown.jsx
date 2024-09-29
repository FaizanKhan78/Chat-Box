import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextField } from "@mui/material";

export default function SelectSmall({ bio }) {
  // console.log(bio);
  const [status, setStatus] = React.useState("");
  const [custom, setCustom] = React.useState("");
  const [statusValue, setStatusValue] = React.useState([
    {
      value: "chatOnly",
      name: "Chat Only",
    },
    {
      value: "available",
      name: "Available",
    },
    {
      value: "busy",
      name: "Busy",
    },
  ]);

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  //! Add Delete Option Also and their should be only 5 status not more than that

  const handleCustom = (e) => {
    if (e.key === "Enter" && custom.length > 0) {
      setStatusValue([
        ...statusValue,
        {
          value: custom.toLowerCase().trim(),
          name: custom,
        },
      ]);
      setCustom("");
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
          <MenuItem key={s.value} value={s.value}>
            {s.name}
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
