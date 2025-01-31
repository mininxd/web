export async function getIP() {
  let res = await fetch("https://ipapi.co/json");
  let ip = await res.json();
  return ip.ip;
}
