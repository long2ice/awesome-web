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
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoFilter } from "react-icons/io5";
import { BsFiles } from "react-icons/bs";
import { GoRepo } from "react-icons/go";
import { getSubTopics } from "../apis/topic";
import Highlighter from "react-highlight-words";

dayjs.extend(relativeTime);

function TopicRepos() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  const [keyword, setKeyword] = useState("");
  const [offset, setOffset] = useState(0);
  const [bottom, setBottom] = useState(false);

  const limit = 20;
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
      setSubTopics((await getSubTopics(topic_id, type)) ?? []);
    })();
  }, [searchParams, type]);
  useEffect(() => {
    (async () => {
      const topic_id = searchParams.get("topic_id") ?? "";
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
    })();
  }, [offset]);
  useEffect(() => {
    if (
      bottom &&
      ((type === "" && offset < data.total) ||
        (type === "repo" && offset < data.repo_total) ||
        (type === "resource" && offset < data.resource_total))
    ) {
      setOffset((offset) => offset + limit);
    }
    if (
      bottom &&
      ((type === "" && offset > data.total) ||
        (type === "repo" && offset > data.repo_total) ||
        (type === "resource" && offset > data.resource_total))
    ) {
      setShowNoData(true);
    }
  }, [bottom]);
  useEffect(() => {
    window.addEventListener("scroll", (e) => {
      setBottom(
        Math.ceil(window.innerHeight + window.scrollY) >=
          document.documentElement.scrollHeight
      );
    });
  }, []);
  useEffect(() => {
    (async () => {
      const topic_id = searchParams.get("topic_id") ?? "";
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
  }, [searchParams, type, subTopic, keyword]);
  const handleSwitch = (type: string) => {
    setData({
      total: data.total,
      repo_total: data.repo_total,
      resource_total: data.resource_total,
      data: [],
    });
    setType(type);
    setOffset(0);
    setBottom(false);
  };
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
        <Paper component="form" sx={{ width: "100%" }}>
          <InputBase
            sx={{ ml: 1, my: 1, flex: 1, width: "100%" }}
            value={keyword}
            placeholder="Search awesome projects here..."
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />
        </Paper>
        <Stack
          direction="row"
          gap={2}
          mt={2}
          display="flex"
          sx={{ flexWrap: "wrap" }}
        >
          <Button
            variant={type === "" ? "contained" : "outlined"}
            onClick={() => handleSwitch("")}
          >
            All ({data.total})
          </Button>
          <Button
            variant={type === "repo" ? "contained" : "outlined"}
            startIcon={<GoRepo />}
            onClick={() => handleSwitch("repo")}
          >
            Repositories ({data.repo_total})
          </Button>
          <Button
            variant={type === "resource" ? "contained" : "outlined"}
            startIcon={<BsFiles />}
            onClick={() => handleSwitch("resource")}
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
                  key={item}
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              ))}
            </List>
          </Drawer>
        </Stack>
      </Box>
      <Masonry spacing={2} columns={{ sm: 1, lg: 4 }}>
        {data.data.map((item: Repo) => (
          <Grow in={true} key={item.id}>
            <Card
              onClick={(e) => window.open(item.url)}
              sx={{ cursor: "pointer", width: "100%" }}
            >
              <CardContent>
                <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                  <Highlighter
                    searchWords={[keyword]}
                    textToHighlight={item.name}
                  />
                </Typography>
                <Typography mt={2} variant="body2" color="text.secondary">
                  <Highlighter
                    searchWords={[keyword]}
                    textToHighlight={item.description}
                  />
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
