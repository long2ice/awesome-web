import { useEffect, useState } from "react";
import { getTopicRepos } from "../apis/repo";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grow,
  IconButton,
  InputBase,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { Masonry } from "@mui/lab";
import { Repo } from "../types/response";
import { GitHub } from "@mui/icons-material";
import { TbGitFork } from "react-icons/tb";
import { AiFillEye, AiFillStar } from "react-icons/ai";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import logo from "../assets/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useSearchParams } from "react-router-dom";

dayjs.extend(relativeTime);

function TopicRepos() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
    const [repos, setRepos] = useState([]);
    const [showNoData, setShowNoData] = useState(false);

    useEffect(() => {
      let limit = 20;
      let offset = 0;
      let total = 0;
      window.addEventListener(
        "scroll",
        async (e) => {
          const bottom =
            Math.ceil(window.innerHeight + window.scrollY) >=
            document.documentElement.scrollHeight;
          if (bottom && offset < total) {
            offset = offset + limit;
            const topic_id = searchParams.get("topic_id") ?? "";
            let data = await getTopicRepos(limit, offset, topic_id);
            total = data.total;
            // @ts-ignore
            setRepos((repos) => [...repos, ...data.data]);
          }
          if (bottom && offset >= total) {
            setShowNoData(true);
          }
        },
        {
          passive: true,
        }
      );
      (async () => {
        const topic_id = searchParams.get("topic_id") ?? "";
        let data = await getTopicRepos(limit, offset, topic_id);
        total = data.total;
        setRepos(data.data);
      })();
    }, [searchParams]);
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
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
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
          {repos.map((item: Repo) => (
            <Grow in={true} key={item.id}>
              <Card>
                <CardContent>
                  <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  {item.type === "repo" && (
                    <Box mt={1}>
                      <Box display="flex" alignItems="center">
                        <AiFillStar />
                        <Chip
                          size="small"
                          color="primary"
                          label={item.star_count}
                        />
                        <TbGitFork />
                        <Chip
                          size="small"
                          color="primary"
                          label={item.fork_count}
                        />
                        <AiFillEye />
                        <Chip
                          size="small"
                          color="primary"
                          label={item.watch_count}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Last updated: {dayjs(item.updated_at).fromNow()}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  {item.type === "repo" && (
                    <Button
                      size="small"
                      onClick={() => window.open(item.url)}
                      variant="outlined"
                      startIcon={<GitHub />}
                    >
                      View in GitHub
                    </Button>
                  )}
                  {item.type === "resource" && (
                    <Button
                      size="small"
                      onClick={() => window.open(item.url)}
                      variant="outlined"
                    >
                      View Resource
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grow>
          ))}
        </Masonry>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={showNoData}
          autoHideDuration={3000}
          onClose={() => setShowNoData(false)}
        >
          <Alert
            severity="warning"
            sx={{ width: "100%" }}
            onClose={() => setShowNoData(false)}
          >
            No more data to be fetched...
          </Alert>
        </Snackbar>
      </Container>
    );
}

export default TopicRepos;
