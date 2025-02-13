import proxy_check from 'proxy-check';

export async function checkProxy(ip, port) {
const proxy = {
  host: ip,
  port
}
let {data} = await proxy_check(proxy)
return data;
}