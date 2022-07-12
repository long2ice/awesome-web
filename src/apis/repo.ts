import axios from "../axios";

async function getTopicRepos(
  limit: number,
  offset: number,
  topic_id?: string | string[] | undefined,
  keyword?: string,
  subtopic?: string,
  type?: string
) {
  const response = await axios.get(`/topic/${topic_id}/repo`, {
    params: {
      keyword,
      limit,
      offset,
      subtopic,
      type,
    },
  });
  return response.data;
}

export { getTopicRepos };
