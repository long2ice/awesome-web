import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grow,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import logo from "../assets/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { getPlatform } from "../apis/platform";
import { Platform, Topic } from "../types/response";
import Icon from "@mui/material/Icon";
import MLink from "@mui/material/Link";
import { getTopic } from "../apis/topic";
import { GitHub, MenuBook } from "@mui/icons-material";
import Masonry from "@mui/lab/Masonry";
import { useNavigate } from "react-router-dom";

function Index() {
  const [platforms, setPlatforms] = useState([]);
  const [platformID, setPlatformID] = useState(0);
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (platformID === 0) {
        let data = await getPlatform();
        setPlatforms(data);
      } else {
        let data = await getTopic(20, 0, platformID, "");
        setTopics(data.data);
      }
    })();
  }, [platformID]);
  return (
    <Container maxWidth="xl">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        mb={2}
      >
        <img
          src={logo}
          width="500"
          height="350"
          onClick={() => {
            setPlatformID(0);
            setTopics([]);
          }}
          style={{ cursor: "pointer" }}
          alt="logo"
        />
        <Paper component="form" sx={{ minWidth: "50%", display: "flex" }}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search awesome projects here..."
          />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
      <Masonry spacing={2}>
        {platformID === 0 &&
          platforms.map((item: Platform) => (
            <Grow in={true} key={item.id}>
              <Card
                sx={{ cursor: "pointer", minWidth: 320 }}
                onClick={() => setPlatformID(item.id)}
              >
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <Icon color="primary">{item.icon}</Icon>
                    <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                      {item.name}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          ))}
        {platformID !== 0 &&
          topics.map((item: Topic) => (
            <Grow in={true} key={item.id}>
              <Card>
                <CardContent>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    {item.name}
                    {item.sub_name === undefined ? "" : ` - ${item.sub_name}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => window.open(item.github_url)}
                    variant="outlined"
                    startIcon={<GitHub />}
                  >
                    View in GitHub
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<MenuBook />}
                    onClick={() => navigate(`/topic?topic_id=${item.id}`)}
                  >
                    Explore
                  </Button>
                </CardActions>
              </Card>
            </Grow>
          ))}
      </Masonry>
      <Box flexDirection="row" display="flex" justifyContent="center">
        <p>
          Copyright © 2022 - All right reserved by
          <MLink
            href="https://github.com/long2ice"
            target="_blank"
            rel="noreferrer"
            ml={1}
          >
            long2ice
          </MLink>
        </p>
      </Box>
    </Container>
  );
}

export default Index;
