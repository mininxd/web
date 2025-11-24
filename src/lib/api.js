import axios from 'axios';

const base_api = import.meta.env.VITE_ENDPOINT || "https://api.example.com";

// Get DNS stats from API endpoint
export async function getDnsStats() {
  try {
    const response = await axios.get(`${base_api}/dns/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching DNS stats:', error);
    throw error;
  }
}

// Get client DNS query info from API endpoint
export async function getClientDnsInfo(ip) {
  try {
    const response = await axios.get(`${base_api}/dns/query?ip=${ip}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching client DNS info:', error);
    throw error;
  }
}

export async function getIpInfo(ip) {
  try {
    let response = await axios.get(`https://api.mininxd.xyz/ip/${ip}`);
    return response.data.data;
  } catch(e) { 
    return ""
  }
}