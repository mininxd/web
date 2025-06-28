import { makeChart } from "./chart.ts";

export default function renderCard({ data, name, isPositive, percentage }, chartElement, cardElement) {
  makeChart(chartElement, data);
  if (!cardElement) return;

  const badgeClass = isPositive ? "badge-success" : "badge-error";
  const sign = isPositive ? "+" : "-";
  const price = parseFloat(data[data.length - 1]).toFixed(2);
  const minPrice = Math.min(...data).toFixed(2);
  const maxPrice = Math.max(...data).toFixed(2);

  cardElement.innerHTML = `
    <div class="card-body">
      <div class="flex justify-between">
        <h1 class="text-4xl font-extrabold">$${price}</h1>
        <div class="gap font-bold text-right">
          <h1 class="badge badge-success">
            $${maxPrice}
          </h1>
          <h1 class="badge badge-error">
            $${minPrice}
          </h1>
          <p class="text-neutral">from last 24h</p>
        </div>
      </div>
      <h1 class="text-xl font-bold text-neutral">${name} Price</h1>
      <hr class="opacity-50" />
      <a href="#${name.toLowerCase()}Chart">
        <div class="font-bold text-neutral">
          <div class="badge mr-2 mb-1 ${badgeClass}">
            <i class="ri-line-chart-line"></i>${sign}${percentage}%
          </div>
          from last hour
        </div>
      </a>
    </div>
  `;
}
