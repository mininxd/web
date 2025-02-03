export async function getIP() {
  let res = await fetch("https://api.seeip.org/jsonip");
  let ip = await res.json();
  if(!ip) {
  document.querySelectorAll('.skeleton').forEach(el => {el.classList.add("hidden")})
  pubIp.innerHTML = "Failed To Fetch!"
  return;
  }
  return ip.ip;
}
