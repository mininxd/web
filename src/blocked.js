
const blocked_content = document.getElementById("blocked_content");
const dns_content = document.getElementById("dns_content");
const blockedUrl = document.getElementById("blockedUrl");
const blocked_redirect = document.getElementById("blocked_redirect");

// Note: checking window.location.origin instead of href ensures we match the domain logic
// However, the original code checked !...includes, which implies if it's NOT the mininxd domain, it's blocked.
const allowedOrigins = [
  "dns.mininxd.xyz",
  "http://localhost:5173"
];

// Function to apply translations to blocked content if user's language is Indonesian
function applyBlockedPageTranslations() {
  // Access the language data from the global language.json import
  // For now, using the same data structure as defined in language.json
  const language = {
    "id-ID": {
      "access_denied_text": "Akses ke {{url}} telah ditolak.",
      "lang_redirect_prev_page": "Mengarahkan Anda ke halaman sebelumnya",
      "request_blocked_messages": "Permintaan Anda diblokir oleh sistem perlindungan DNS."
    }
  };

  const id_lang = language["id-ID"];
  if(navigator.language == "id-ID" && id_lang) {
    // Update blocked page elements if they exist
    if (document.getElementById('request_blocked_messages')) {
      document.getElementById('request_blocked_messages').innerHTML = id_lang.request_blocked_messages;
    }
    if (document.getElementById('lang_redirect_prev_page')) {
      document.getElementById('lang_redirect_prev_page').innerHTML = id_lang.lang_redirect_prev_page;
    }
    if (document.getElementById('access_denied_text')) {
      const url = document.getElementById('blockedUrl')?.textContent || window.location.origin;
      // Wrap the URL in the same styling as the default English version
      const styledUrl = `<span class="font-bold text-red-500">${url}</span>`;
      document.getElementById('access_denied_text').innerHTML = id_lang.access_denied_text.replace('{{url}}', styledUrl);
    }
  }
}

if (!allowedOrigins.some(url => window.location.origin.includes(url))) {
  console.log("Blocked: Origin does not match allowed domain.");

  if (blocked_content && dns_content && blockedUrl && blocked_redirect) {
    blocked_content.classList.remove("hidden");
    blocked_content.style.display = "block";

    dns_content.classList.add("hidden");
    dns_content.style.display = "none";

    blockedUrl.innerText = window.location.origin;

    // Apply translations to blocked content if needed
    applyBlockedPageTranslations();

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
        setTimeout(() => {
          window.close();
        }, 100);
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
