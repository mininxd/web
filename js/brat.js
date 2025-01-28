import axios from "axios";

export async function brat(text) {
  try {
  let { data } = await axios.get(`https://brat.caliphdev.com/api/brat?text=${text}`);
  return data;
  } catch(e) {
  return e;
  }
}