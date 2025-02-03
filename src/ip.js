export async function getIP() {
  let res = await fetch("https://api.seeip.org/jsonip");
  let ip = await res.json();
  return ip.ip;
}
