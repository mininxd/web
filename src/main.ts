import { getPrice } from "./lib/price.ts";
import { makeChart } from "./lib/chart.ts";
import renderCard from "./lib/render.ts";
import generateQR from "./lib/qris.ts";
import 'remixicon/fonts/remixicon.css';

generateQR(qris);

getPrice("oil").then(oil =>
  renderCard(oil, oilChart, oilCard)
);
getPrice("hydrogen").then(hydrogen =>
  renderCard(hydrogen, hydrogenChart, hydrogenCard)
);
getPrice("coal").then(coal =>
  renderCard(coal, coalChart, coalCard) 
);
getPrice("u235").then(u235 =>
  renderCard(u235, u235Chart, u235Card)
);
getPrice("co2").then(co2 =>
  renderCard(co2, co2Chart, co2Card)
);



if(!navigator.userAgent.includes("Mobile")) {
  gridWrapper.classList.add("grid", "grid-cols-2", "grid-rows-auto", "gap-8");
  canvasWrapper.classList.add("grid", "grid-cols-2", "grid-rows-auto", "gap-8");
  const allCanvas = document.querySelectorAll("canvas");

allCanvas.forEach((canvas) => {
  canvas.classList.add("max-w-full")
});
  content.classList.add("px-[10%]", "py-[5%]")
}