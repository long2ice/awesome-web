import axios from "../lib/axios";

async function getPlatform() {
  const response = await axios.get(`/platform`);
  return response.data;
}

export { getPlatform };
