function pad(d) {
  return d < 10 ? "0" + d.toString() : d.toString();
}

function toCRC16(str) {
  function charCodeAt(str, i) {
    const get = str.substr(i, 1);
    return get.charCodeAt();
  }

  let crc = 0xffff;
  const strlen = str.length;
  for (let c = 0; c < strlen; c++) {
    crc ^= charCodeAt(str, c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  let hex = crc & 0xffff;
  hex = hex.toString(16);
  hex = hex.toUpperCase();
  if (hex.length == 3) {
    hex = "0" + hex;
  }
  return hex;
}

function get_between(string, start, end) {
  string = " " + string;
  let ini = string.indexOf(start);
  if (ini == 0) return "";
  ini += start.length;
  const len = string.indexOf(end, ini) - ini;
  return string.substr(ini, len);
}

function dataQris(str) {
  const dump_nmid = get_between(str, "15ID", "0303");
  const nmid = "ID" + dump_nmid;
  const search_id = str.search("A01");
  const id = search_id == "-1" ? "01" : "A01";
  const merchantName = get_between(str, "ID59", "60")
    .substring(2)
    .trim()
    .toUpperCase();
  const getPencetak = str.match(/(?<=ID|COM).+?(?=0118)/g);
  const jmlPencetak = getPencetak.length;
  const getNamePencetak = getPencetak[jmlPencetak - 1].split(".");
  const pencetak =
    getNamePencetak.length == 3 ? getNamePencetak[1] : getNamePencetak[2];
  const getNns = str.match(/(?<=0118).+?(?=ID)/g);
  const jmlNns = getNns.length;
  const nns = getNns[jmlNns - 1].substring(0, 8);
  const strnoncrc = str.slice(0, -4);
  const crc = str.substring(str.length - 3);
  const getCrc = toCRC16(strnoncrc);
  const cekCrc = crc == getCrc;
  return {
    nmid: nmid,
    id: id,
    merchantName: merchantName,
    pencetak: pencetak,
    nns: nns,
    crc: cekCrc,
  };
}

export { pad, toCRC16, dataQris };
