import axios from "axios";

function getPercentChangeInfo(data) {
  if (data.length < 2) return { value: 0, isPositive: null };
  const prev = data[data.length - 2];
  const current = data[data.length - 1];
  const change = ((current - prev) / prev) * 100;
  
  return {
    percentage: Math.round(Math.abs(change)),
    isPositive: change >= 0
  };
}

function capital(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getPrice(type) {
  return axios.get(`https://api-mininxd.vercel.app/energy/${type}`)
    .then(res => {
      const data = res.data;
      const percentage = getPercentChangeInfo(data);
      return { 
        name: capital(type),
        data, 
        ...percentage 
      };
    })
    .catch(() => "err");
}

