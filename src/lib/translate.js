import language from "./language.json";
const id_lang = language["id-ID"];

if(navigator.language == "id-ID") {
  if(id_lang) {
    title_header.innerHTML = id_lang.title_header;
    subtitle_text.innerHTML = id_lang.subtitle_text;
    getting_ip_text.innerHTML = id_lang.getting_ip_text;
    top_blocked_domains_text.innerHTML = id_lang.top_blocked_domains_text;
    dns_over_tls_text.innerHTML = id_lang.dns_over_tls_text;
    dns_over_https_text.innerHTML = id_lang.dns_over_https_text;
    how_to_connect_dot_text.innerHTML = id_lang.how_to_connect_dot_text;
    how_to_connect_doh_text.innerHTML = id_lang.how_to_connect_doh_text;
    request_blocked_messages.innerHTML = id_lang.request_blocked_messages;
    lang_redirect_prev_page.innerHTML = id_lang.lang_redirect_prev_page;
    access_denied_text.innerHTML = id_lang.access_denied_text;
  }
}