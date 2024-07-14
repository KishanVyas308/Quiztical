
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  styled,
} from "@mui/material";
import { LinkedIn, GitHub, Email } from "@mui/icons-material";
import Tilt from "react-parallax-tilt";
import developerPhoto from "../../assets/github-profile-pic.jpg";

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.grey[600],
  margin: theme.spacing(1, 0),
}));

const AboutUs = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        padding: "2rem",
        borderRadius: "15px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.05}>
        <Card
          sx={{
            backgroundColor: "black",
            color: "white",
            borderRadius: "15px",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Avatar
              src={developerPhoto}
              alt="Developer Photo"
              sx={{
                width: 120,
                height: 120,
                marginBottom: 2,
                border: "4px solid white",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            />
            <Typography variant="h4" gutterBottom>
              Kishan Vyas
            </Typography>
            <Typography variant="h6" gutterBottom>
              Full Stack / Web3 Developer
            </Typography>
            <Typography variant="body2" color="grey.400" gutterBottom>
              🌐 Web3 Enthusiast 
            </Typography>
            <StyledDivider />
            <Typography variant="body2" color="grey.400" gutterBottom>
              🔥 MERN Stack Developer
            </Typography>
            <StyledDivider />
            <Typography variant="body2" color="grey.400" gutterBottom>
              💼 Experienced in TypeScript, Firebase, PostgreSQL, Prisma, and Hono
            </Typography>
            <StyledDivider />
      
           
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                marginTop: 2,
              }}
            >
              <Tooltip title="LinkedIn">
                <IconButton
                  color="primary"
                  href="https://www.linkedin.com/in/kishan-vyas-aa4245251/"
                  target="_blank"
                  sx={{ "&:hover": { color: "#0e76a8" } }}
                >
                  <LinkedIn />
                </IconButton>
              </Tooltip>
              <Tooltip title="GitHub">
                <IconButton
                  color="primary"
                  href="https://github.com/Kishan-Vyas"
                  target="_blank"
                  sx={{ "&:hover": { color: "#0e76a8" } }}
                >
                  <GitHub />
                </IconButton>
              </Tooltip>
              <Tooltip title="Email">
                <IconButton
                  color="primary"
                  href="mailto:kishanvyas308@gmail.com"
                  sx={{ "&:hover": { color: "#0e76a8" } }}
                >
                  <Email />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      </Tilt>
    </Container>
  );
};

export default AboutUs;
