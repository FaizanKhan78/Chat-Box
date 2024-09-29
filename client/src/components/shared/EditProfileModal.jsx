import { useTheme } from "@emotion/react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Stack,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useState } from "react";

const EditProfileModal = ({ open, setOpen, initialData, onSave }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    fullName: initialData.fullName,
    email: initialData.email,
    phone: initialData.phone,
    gender: initialData.gender,
    bio: initialData.bio,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    onSave(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Personal Information</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ marginTop: "10px" }}>
          <TextField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
          />
          <FormControl>
            <FormLabel id="gender-label">Gender</FormLabel>
            <RadioGroup
              row
              aria-labelledby="gender-label"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}>
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>

          <Typography sx={{ fontSize: "20px" }}>Bio</Typography>
          <TextareaAutosize
            style={{
              backgroundColor: theme.palette.text.bgColor,
              color: theme.palette.secondary.main, // add this for text color contrast
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            minRows={3}
            placeholder="Type something..."
            value={initialData.bio}
            name="bio"
            onChange={handleInputChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
