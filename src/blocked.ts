if(!window.location.origin.includes("dns.mininxd.xyz")) {
  console.log(true)
  blocked_content.classList.remove("hidden");
  blocked_content.style.display = "block";
  dns_content.classList.add("hidden");
  dns_content.style.display = "none";
}