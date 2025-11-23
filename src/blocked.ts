
const blocked_content = document.getElementById("blocked_content");
const dns_content = document.getElementById("dns_content");
const blockedUrl = document.getElementById("blockedUrl");
const blocked_redirect = document.getElementById("blocked_redirect");

// Note: checking window.location.origin instead of href ensures we match the domain logic
// However, the original code checked !...includes, which implies if it's NOT the mininxd domain, it's blocked.

if (!window.location.origin.includes("dns.mininxd.xyz")) {
  console.log("Blocked: Origin does not match allowed domain.");
  
  if (blocked_content && dns_content && blockedUrl && blocked_redirect) {
    blocked_content.classList.remove("hidden");
    blocked_content.style.display = "block";

    dns_content.classList.add("hidden");
    dns_content.style.display = "none";

    blockedUrl.innerText = window.location.origin;

    let i = 5;
    const countdown = () => {
      i--;
      if (blocked_redirect) blocked_redirect.innerText = i.toString();

      if (i <= 0) {
        if (document.referrer) {
          window.location.href = document.referrer;
        } else {
          window.history.back();
        }
        return;
      }
      setTimeout(countdown, 1000);
    };

    // Initial display
    blocked_redirect.innerText = i.toString();
    setTimeout(countdown, 1000);
  }
} else {
  // Safe origin
  // Ensure the blocked content is hidden and dns content is visible
  if (blocked_content) {
    blocked_content.classList.add("hidden");
    blocked_content.style.display = "none";
  }
  if (dns_content) {
    dns_content.classList.remove("hidden");
    // If there's a specific display style needed for dns_content, apply it, otherwise 'block' or default.
    // The original code didn't set display property when visible, just removed hidden.
    // But since we might have set display: none previously or in css...
    // The HTML doesn't have display: none on dns_content by default.
    dns_content.style.display = "";
  }
}
