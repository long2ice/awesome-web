import axios from "../axios";

async function getTopic(platform_id?: number, keyword?: string) {
  const response = await axios.get(`/topic`, {
    params: {
      platform_id,
      keyword,
    },
  });
  return response.data;
}

async function getSubTopics(topic_id: string, type: string) {
  const response = await axios.get(`/topic/${topic_id}/subtopics`, {
    params: {
      type,
    },
  });
  return response.data;
}

export { getTopic, getSubTopics };
