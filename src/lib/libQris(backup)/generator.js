// Server-side QRIS generation function
// Located at /lib/server/libQris/generator.js
// Provides QRIS code generation logic
function generateQris(qris, qty, tax, taxtype, fee) {
  // TAX system not tested
  tax = "n"; // Ya-Tidak Biaya Layanan
  taxtype = "p"; // Rupiah(r) / Persen(p)

  if (typeof fee !== "string") {
    fee = fee.toString();
  }

  console.log(fee);
  if (tax == "y") {
    if (taxtype === "r") {
      fee = "55020256" + String(fee.length).padStart(2, "0") + fee;
    } else if (taxtype === "p") {
      fee = "55020357" + String(fee.length).padStart(2, "0") + fee;
    }
  }

  console.log("55020256" + String(fee.length).padStart(2, "0") + fee);
  console.log("55020357" + String(fee.length).padStart(2, "0") + fee);

  if (typeof qty !== "string") {
    qty = qty.toString();
  }
  let qrisModified = qris.substring(0, qris.length - 4);
  let step1 = qrisModified.replace("010211", "010212");
  let step2 = step1.split("5802ID");
  let uang = "54" + String(qty.length).padStart(2, "0") + qty;

  //   uang += "5802ID";
  // TAX Content

  if (fee == "0" || !fee) {
    uang += "5802ID";
  } else {
    uang += fee + "5802ID";
  }

  let fix = step2[0].trim() + uang + step2[1].trim();
  fix += ConvertCRC16(fix);
  return fix;

  function ConvertCRC16(str) {
    function charCodeAt(str, i) {
      return str.charCodeAt(i);
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
    hex = hex.toString(16).toUpperCase();
    if (hex.length === 3) hex = "0" + hex;
    return hex;
  }
}

export default generateQris;
