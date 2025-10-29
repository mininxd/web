// QRIS library
// Located at /src/lib/qris.js
// This file is imported by frontend JavaScript files to interact with QRIS functionality

export async function qris(qrisCode, nominal) {
  try {
    // Check if we're running in a browser environment
    if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
      // First, extract merchant name from the QRIS code for immediate display
      const qrisInfo = parseQrisData(qrisCode);
      
      // If nominal is 0, just return merchant info without API call
      if (nominal === 0 || nominal === "0") {
        return {
          merchant: qrisInfo.merchantName,
          QR: qrisCode, // Return original code for merchant info
          harga: 0
        };
      }
      
      // Use fetch for browser environments
      let response;
      
      // Check if we have a local backend running
      try {
        // Try local API first
        response = await fetch(`/api/qris?qris=${encodeURIComponent(qrisCode)}&nominal=${nominal}`);
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (localError) {
        console.log("Local API not available, trying public API");
      }
      
      // Fallback to public API
      const apiUrl = `https://api-mininxd.vercel.app/qris?qris=${encodeURIComponent(qrisCode)}&nominal=${nominal}`;
      const apiResponse = await fetch(apiUrl);
      
      if (!apiResponse.ok) {
        throw new Error(`API request failed with status ${apiResponse.status}`);
      }
      
      const data = await apiResponse.json();
      return data;
    } else {
      // For environments without fetch (Node.js), create a mock response or throw error
      throw new Error("fetch is not available in this environment");
    }
  } catch (error) {
    console.error("Error in qris function:", error);
    throw error;
  }
}

export async function generateQrisWithOptions(qrisCode, nominal, options = {}) {
  const {
    tax = "n",
    taxtype = "p", 
    fee = 0
  } = options;

  try {
    // Check if we're running in a browser environment
    if (typeof window !== 'undefined' && typeof fetch !== 'undefined') {
      // Use fetch for browser environments
      let response;
      
      // Check if we have a local backend running
      try {
        // Try local API first
        response = await fetch(`/api/qris`, {
          method: 'GET',
          params: {
            qris: qrisCode,
            nominal: nominal,
            tax: tax,
            taxtype: taxtype,
            fee: fee
          }
        });
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (localError) {
        console.log("Local API not available, trying public API");
      }
      
      // Fallback to public API
      const apiUrl = `https://api-mininxd.vercel.app/qris?qris=${encodeURIComponent(qrisCode)}&nominal=${nominal}&tax=${tax}&taxtype=${taxtype}&fee=${fee}`;
      const apiResponse = await fetch(apiUrl);
      
      if (!apiResponse.ok) {
        throw new Error(`API request failed with status ${apiResponse.status}`);
      }
      
      const data = await apiResponse.json();
      return data;
    } else {
      // For environments without fetch (Node.js), create a mock response or throw error
      throw new Error("fetch is not available in this environment");
    }
  } catch (error) {
    console.error("Error in generateQrisWithOptions function:", error);
    throw error;
  }
}

/**
 * Helper function that mimics the get_between function from libQris/crc.js
 */
function getBetween(string, start, end) {
    string = " " + string;
    let ini = string.indexOf(start);
    if (ini == 0) return "";
    ini += start.length;
    let len = string.indexOf(end, ini) - ini;
    return string.substr(ini, len);
}

export function parseQrisData(qrisCode) {
  // This function mimics the dataQris functionality from libQris/crc.js
  try {
    // Extract NMID
    const dumpNmid = getBetween(qrisCode, "15ID", "0303");
    const nmid = "ID" + dumpNmid;

    // Find ID type
    const searchId = qrisCode.search("A01");
    const id = (searchId === -1) ? "01" : "A01";

    // Extract merchant name using the same logic as in original dataQris
    let merchantSection = getBetween(qrisCode, "ID59", "60");
    let merchantName = "Unknown Merchant";
    
    if (merchantSection) {
      // Apply the same logic as the original function: get text between ID59 and 60, 
      // then remove first 2 characters (which should be the length indicator)
      merchantName = merchantSection.substring(2).trim().toUpperCase();
      
      // Additional processing: if the result starts with numbers followed by a space,
      // the actual merchant name might be after that number prefix
      // For example: "082 PUSK MODOPURO" -> "PUSK MODOPURO"
      if (/^\d+\s+/.test(merchantName)) {
        // Extract everything after the first number and space sequence
        const match = merchantName.match(/^\d+\s+(.+)$/);
        if (match && match[1]) {
          merchantName = match[1].trim();
        }
      }
    }

    // Extract other fields with more accurate pattern matching
    // Extract pencetak (service provider)
    let pencetak = "Unknown";
    try {
      const getPencetak = qrisCode.match(/(?<=ID|COM).+?(?=0118)/g);
      if (getPencetak && getPencetak.length > 0) {
        const jmlPencetak = getPencetak.length;
        const getNamePencetak = getPencetak[jmlPencetak - 1].split('.');
        pencetak = (getNamePencetak.length == 3) ? getNamePencetak[1] : (getNamePencetak.length > 1 ? getNamePencetak[getNamePencetak.length - 1] : getNamePencetak[0]);
      }
    } catch (e) {
      // If regex fails, default to unknown
      pencetak = "Unknown";
    }

    // Extract NNS (field 62)
    let nns = "00000000";
    try {
      const getNns = qrisCode.match(/(?<=0118).+?(?=ID)/g);
      if (getNns && getNns.length > 0) {
        const jmlNns = getNns.length;
        nns = getNns[jmlNns - 1].substring(0, 8);
      }
    } catch (e) {
      // If regex fails, keep default value
    }

    // Check CRC
    const qrisWithoutCrc = qrisCode.slice(0, -4);
    const providedCrc = qrisCode.substring(qrisCode.length - 4);
    const calculatedCrc = calculateCRC16(qrisWithoutCrc);
    const crcValid = providedCrc === calculatedCrc;

    return {
      nmid: nmid,
      id: id,
      merchantName: merchantName,
      pencetak: pencetak,
      nns: nns,
      crc: crcValid
    };
  } catch (e) {
    console.error("Error parsing QRIS data:", e);
    return {
      nmid: "",
      id: "",
      merchantName: "Invalid QRIS Code",
      pencetak: "",
      nns: "",
      crc: false
    };
  }
}

export function generateQrisLocally(qris, qty, tax = "n", taxtype = "p", fee = 0) {
  // This function implements the same logic as lib/libQris/generator.js
  try {
    // Set defaults as in the original generator
    tax = "n";     // Ya-Tidak Biaya Layanan
    taxtype = "p";    // Rupiah(r) / Persen(p)

    if (typeof fee !== 'string') {
      fee = fee.toString();
    }

    let feeStr = "";
    if (tax == "y") {
      if (taxtype === 'r') {
        feeStr = "55020256" + String(fee.length).padStart(2, '0') + fee;
      } else if (taxtype === 'p') {
        feeStr = "55020357" + String(fee.length).padStart(2, '0') + fee;
      }
    }

    if (typeof qty !== 'string') {
      qty = qty.toString();
    }
    
    // Remove CRC from original QRIS code
    let qrisModified = qris.substring(0, qris.length - 4);
    // Update version from 010211 to 010212
    let step1 = qrisModified.replace("010211", "010212");
    // Split at the country code marker "5802ID"
    let step2 = step1.split("5802ID");
    
    // Create the amount field (tag 54)
    let uang = "54" + String(qty.length).padStart(2, '0') + qty;

    // Add fee if applicable, otherwise add country code marker
    if (feeStr === "" || !feeStr) {
        uang += "5802ID";
    } else {
        uang += feeStr + "5802ID";
    }

    // Combine the parts
    let fix = step2[0].trim() + uang + step2[1].trim();
    // Add CRC to complete the QRIS code
    fix += calculateCRC16(fix);
    return fix;
  } catch (error) {
    console.error("Error in generateQrisLocally function:", error);
    return qris; // Return original if error occurs
  }
}

/**
 * Helper function to extract the service provider name
 */
function extractPencetak(qrisCode) {
  try {
    // Try to extract from field 26 (payment network)
    const pencetakMatch = qrisCode.match(/26\d{2}00\d{2}([A-Z.]+)/);
    if (pencetakMatch) {
      const fullMatch = pencetakMatch[1];
      const parts = fullMatch.split('.');
      // Return the service provider name (e.g., GO-JEK from COM.GO-JEK.WWW)
      if (parts.length >= 2) {
        return parts[1];
      } else {
        return parts[0];
      }
    }
    return "Unknown";
  } catch (e) {
    return "Unknown";
  }
}

/**
 * Calculate CRC16 for QRIS code validation
 */
function calculateCRC16(str) {
  let crc = 0xFFFF;
  const strlen = str.length;
  for (let c = 0; c < strlen; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }

  let hex = crc & 0xFFFF;
  hex = hex.toString(16).toUpperCase();
  if (hex.length === 3) hex = "0" + hex;
  return hex;
}