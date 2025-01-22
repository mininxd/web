const referrer = document.referrer;

if (referrer) {
  referMsg.innerHTML = referrer;
  if (referrer.match(/ads|track|iklan|verif|loker/)) {
    judul.innerHTML = "Situs Tracker"
    informasi.innerHTML = "Anda tampaknya mencoba mengakses situs pelacak. Demi keamanan dan privasi Anda, akses ke situs ini telah dihentikan."
  } else if(referrer.match(/gamble|judi|qq|capsa|prediksi|win|togel|bola|jaya|777|domino|dewa|poker|sport|tebak|raja|hoki|hoky|toto|abadi|octa|casino|fx|naga|kiu|gambling|bet|cuan|zeus|slot/)) {
    judul.innerHTML = "Situs Gambling"
    informasi.innerHTML = "Situs ini dideteksi sebagai platform perjudian. Aktivitas semacam ini berisiko terhadap keamanan finansial dan privasi Anda. Akses telah dihentikan"
  }
}