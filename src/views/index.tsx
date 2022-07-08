import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Grow,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { getPlatform } from "../apis/platform";
import { Platform, Topic } from "../types/response";
import Icon from "@mui/material/Icon";
import { getTopic } from "../apis/topic";
import { GitHub, MenuBook } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Highlighter from "react-highlight-words";

function Index() {
  const [platforms, setPlatforms] = useState([]);
  const [platformID, setPlatformID] = useState(0);
  const [topics, setTopics] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (platformID === 0 && keyword === "") {
        let data = await getPlatform();
        setPlatforms(data);
      } else {
        let data = await getTopic(platformID, keyword);
        setTopics(data.data);
      }
    })();
  }, [platformID, keyword]);
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
            setKeyword("");
          }}
          style={{ cursor: "pointer" }}
          alt="logo"
        />
        <Paper component="form" sx={{ width: "100%" }}>
          <InputBase
            sx={{ ml: 1, my: 1, flex: 1, width: "100%" }}
            value={keyword}
            placeholder="Search awesome projects here..."
            onChange={(e) => {
              setKeyword(e.target.value);
              setTopics([]);
            }}
          />
        </Paper>
      </Box>
      <Grid container spacing={2}>
        {platformID === 0 &&
          keyword === "" &&
          platforms.map((item: Platform) => (
            <Grid item>
              <Grow in={true} key={item.id}>
                <Card
                  sx={{ cursor: "pointer" }}
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
            </Grid>
          ))}
        {(platformID !== 0 || keyword !== "") &&
          topics.map((item: Topic) => (
            <Grid item>
              <Grow in={true} key={item.id}>
                <Card sx={{ width: "100%" }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                      <Highlighter
                        searchWords={[keyword]}
                        textToHighlight={item.name}
                      />
                      <Highlighter
                        searchWords={[keyword]}
                        textToHighlight={
                          item.sub_name === undefined
                            ? ""
                            : ` - ${item.sub_name}`
                        }
                      />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Highlighter
                        searchWords={[keyword]}
                        textToHighlight={item.description}
                      />
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
                      onClick={() => navigate(`/repo?topic_id=${item.id}`)}
                    >
                      Explore
                    </Button>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}

export default Index;
