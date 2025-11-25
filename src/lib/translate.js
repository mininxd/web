import language from "./language.json";
const id_lang = language["id-ID"];

if(navigator.language == "id-ID") {
  if(id_lang) {
    // Update main page elements if they exist
    if (document.getElementById('title_header')) {
      document.getElementById('title_header').innerHTML = id_lang.title_header;
    }
    if (document.getElementById('subtitle_text')) {
      document.getElementById('subtitle_text').innerHTML = id_lang.subtitle_text;
    }
    if (document.getElementById('getting_ip_text')) {
      document.getElementById('getting_ip_text').innerHTML = id_lang.getting_ip_text;
    }
    if (document.getElementById('top_blocked_domains_text')) {
      document.getElementById('top_blocked_domains_text').innerHTML = id_lang.top_blocked_domains_text;
    }
    if (document.getElementById('dns_over_tls_text')) {
      document.getElementById('dns_over_tls_text').innerHTML = id_lang.dns_over_tls_text;
    }
    if (document.getElementById('dns_over_https_text')) {
      document.getElementById('dns_over_https_text').innerHTML = id_lang.dns_over_https_text;
    }
    if (document.getElementById('how_to_connect_dot_text')) {
      document.getElementById('how_to_connect_dot_text').innerHTML = id_lang.how_to_connect_dot_text;
    }
    if (document.getElementById('how_to_connect_doh_text')) {
      document.getElementById('how_to_connect_doh_text').innerHTML = id_lang.how_to_connect_doh_text;
    }
  }
}