const md5 = require("md5");

const secret = process.env.NEXT_PUBLIC_API_SECRET;
const getRandomStr = (length: number) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const get_sign = (
  data: Record<string, any>,
  timestamp: number,
  nonce: string
) => {
  let kvs = [`timestamp=${timestamp}`, `nonce=${nonce}`];
  for (const k in data) {
    kvs.push(`${k}=${data[k]}`);
  }
  let s = kvs.sort().join("&") + `&key=${secret}`;
  return md5(s).toUpperCase();
};
export { get_sign, getRandomStr };
