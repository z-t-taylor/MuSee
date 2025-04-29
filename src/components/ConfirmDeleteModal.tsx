import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>{title}</DialogTitle>
    {description && <DialogContent>{description}</DialogContent>}
    <DialogActions>
      <Button
        onClick={onCancel}
        sx={{
          px: 2,
          py: 1,
          color: "grey.600",
          border: 1,
          borderColor: "divider",
          textTransform: "none",
          fontFamily: "sans-serif",
          borderRadius: "0.75rem",
          "&:hover": {
            backgroundColor: "grey.100",
          },
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        color="error"
        sx={{
          px: 2,
          py: 1,
          color: "red.500",
          border: 1,
          borderColor: "divider",
          borderRadius: "0.75rem",
          textTransform: "none",
          fontFamily: "sans-serif",
        }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);
