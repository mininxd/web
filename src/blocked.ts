if(!window.location.origin.includes("dns.mininxd.xyz")) {
  console.log(true)
  blocked_content.classList.remove("hidden");
  blocked_content.style.display = "block";
  dns_content.classList.add("hidden");
  dns_content.style.display = "none";
  
  blockedUrl.append(window.location.origin);

let i = 5;
function countdown() {
  i--;
  blocked_redirect.innerHTML = i;

  if (i <= 0) {
    if (document.referrer) {
      window.location.href = document.referrer;
    } else {
      window.history.back();
    }
    return;
  }

  setTimeout(countdown, 1000);
}

countdown();
}