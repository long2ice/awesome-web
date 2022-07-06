import axios from "../lib/axios";

async function getTopicRepos(
  limit: number,
  offset: number,
  topic_id?: string | string[] | undefined,
  keyword?: string
) {
  const response = await axios.get(`/topic/${topic_id}/repo`, {
    params: {
      topic_id,
      keyword,
      limit,
      offset,
    },
  });
  return response.data;
}

export { getTopicRepos };
