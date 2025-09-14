import { styled, alpha } from "@mui/material/styles";
import { Paper, TextField, Button } from "@mui/material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#ffffff",
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12)",
  overflow: "hidden",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "6px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: (theme.shape.borderRadius as number) * 3,
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    },
    "&.Mui-focused": {
      boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.25)}`,
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: (theme.shape.borderRadius as number) * 3,
  padding: "10px 24px",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
  transition: "all 0.3s",
  fontWeight: 600,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
}));

export { StyledPaper, SearchTextField, ActionButton };
