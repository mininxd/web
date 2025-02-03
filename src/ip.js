import axios from "axios";

export async function ipv4() {
let {data} = await axios.get("https://api-mininxd.vercel.app/ip");
return data.ip.ipv4;
}

export async function ipv6() {
  let {data} = await axios.get("https://api-mininxd.vercel.app/ip");
  return data.ip.ipv6;
}

