import React, { useEffect, useState } from "react";
import { getTopicRepos } from "../apis/repo";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Drawer,
  Grow,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { Masonry } from "@mui/lab";
import { Repo, Repos } from "../types/response";
import { TbGitFork } from "react-icons/tb";
import { AiFillStar } from "react-icons/ai";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import logo from "../assets/logo.png";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoFilter } from "react-icons/io5";
import { BsFiles } from "react-icons/bs";
import { GoRepo } from "react-icons/go";
import { getSubTopics } from "../apis/topic";

dayjs.extend(relativeTime);

function TopicRepos() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showNoData, setShowNoData] = useState(false);
  const [data, setData] = useState<Repos>({
    data: [],
    repo_total: 0,
    resource_total: 0,
    total: 0,
  });
  const [subTopics, setSubTopics] = useState([]);
  const [type, setType] = useState("");
  const [subTopic, setSubTopic] = useState("");
  const [open, setOpen] = useState(false);
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };
  useEffect(() => {
    (async () => {
      const topic_id = searchParams.get("topic_id") ?? "";
      setSubTopics(await getSubTopics(topic_id, type));
    })();
  }, [searchParams, type]);
  useEffect(() => {
    let limit = 20;
    let offset = 0;
    window.addEventListener(
      "scroll",
      async (e) => {
        const bottom =
          Math.ceil(window.innerHeight + window.scrollY) >=
          document.documentElement.scrollHeight;
        if (bottom && offset < data.total) {
          offset = offset + limit;
          const topic_id = searchParams.get("topic_id") ?? "";
          const keyword = searchParams.get("keyword") ?? "";
          let res = await getTopicRepos(
            limit,
            offset,
            topic_id,
            keyword,
            subTopic,
            type
          );
          setData({
            total: res.total,
            repo_total: res.repo_total,
            resource_total: res.resource_total,
            data: [...data.data, ...res.data],
          });
          // @ts-ignore
          setRepos((repos) => [...repos, ...data.data]);
        }
        if (bottom && offset >= data.total) {
          setShowNoData(true);
        }
      },
      {
        passive: true,
      }
    );
    (async () => {
      const topic_id = searchParams.get("topic_id") ?? "";
      const keyword = searchParams.get("keyword") ?? "";
      let data = await getTopicRepos(
        limit,
        offset,
        topic_id,
        keyword,
        subTopic,
        type
      );
      setData(data);
    })();
  }, [searchParams, type, subTopic]);
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
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained">All ({data.total})</Button>
          <Button
            variant="contained"
            startIcon={<GoRepo />}
            onClick={() => setType("repo")}
          >
            Repositories ({data.repo_total})
          </Button>
          <Button
            variant="contained"
            startIcon={<BsFiles />}
            onClick={() => setType("resource")}
          >
            Resources ({data.resource_total})
          </Button>
          <Button variant="contained" onClick={toggleDrawer(true)}>
            <IoFilter />
          </Button>
          <Drawer open={open} anchor="right" onClose={toggleDrawer(false)}>
            <List onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
              {subTopics.map((item) => (
                <ListItemButton
                  selected={item === subTopic}
                  onClick={() => setSubTopic(item)}
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              ))}
            </List>
          </Drawer>
        </Stack>
      </Box>
      <Masonry spacing={2}>
        {data.data.map((item: Repo) => (
          <Grow in={true} key={item.id}>
            <Card
              onClick={(e) => window.open(item.url)}
              sx={{ cursor: "pointer" }}
            >
              <CardContent>
                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                  {item.name}
                </Typography>
                <Typography mt={2} variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                {item.type === "repo" && (
                  <Box mt={2}>
                    <Box display="flex" alignItems="center">
                      <AiFillStar />
                      <Chip
                        size="small"
                        color="primary"
                        label={item.star_count ?? 0}
                        sx={{ ml: 1 }}
                      />
                      <Box ml={2}>
                        <TbGitFork />
                      </Box>
                      <Chip
                        size="small"
                        color="primary"
                        label={item.fork_count ?? 0}
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Last updated: {dayjs(item.updated_at).fromNow()}
                    </Typography>
                  </Box>
                )}
              </CardContent>
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
