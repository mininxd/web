import gsap from "gsap";
import axios from "axios";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
gsap.registerPlugin(ScrambleTextPlugin);


(async() => {
let ip = await axios.get("https://api-mininxd.vercel.app/ip");
const ipv4 = ip.data.ip.ipv4

gsap.to("#titleHeader", {
  duration: 1, 
  scrambleText: "MININXD DNS"
});
})()