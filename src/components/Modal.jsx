import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CommonModal = ({ open, onClose, children, width = 350 }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          // 🔥 Responsive widths using MUI breakpoints
            width: {
              xs: "50%",   // small screens
              sm: 250,     // tablets
              md: 300,     // laptops
              lg: 350      // desktops
            },
          // maxWidth: width,
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>

        {children}
      </Box>
    </Modal>
  );
};

export default CommonModal;
