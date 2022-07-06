import axios from "../lib/axios";

async function getTopic(
  limit: number,
  offset: number,
  platform_id?: number,
  keyword?: string
) {
  const response = await axios.get(`/topic`, {
    params: {
      platform_id,
      keyword,
      limit,
      offset,
    },
  });
  return response.data;
}

export { getTopic };
