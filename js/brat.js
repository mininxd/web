import axios from "axios";


export async function brat(text) {
  try {
    const { data } = await axios.get(
      `https://api-mininxd.vercel.app/brat?txt=${encodeURIComponent(text)}`,
      {
        responseType: "arraybuffer",
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
        }
      }
    );
    const blob = new Blob([data], { type: 'image/jpeg' });
  const url = URL.createObjectURL(blob);
  console.log(data, blob, url)
    return url;
  } catch (e) {
    throw new Error(e);
    return e;
  }
}
