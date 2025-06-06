import { makeChart } from "./chart.ts";

export default function renderCard({ data, name, isPositive, percentage }, chartElement, cardElement) {
  makeChart(chartElement, data);
  if (!cardElement) return;

  const badgeClass = isPositive ? "badge-success" : "badge-error";
  const sign = isPositive ? "+" : "-";

  cardElement.innerHTML = `
    <div class="card-body">
      <h1 class="text-4xl font-extrabold">$${data[data.length - 1]}</h1>
      <h1 class="text-xl font-bold text-neutral">${name} Price</h1>
      <hr class="opacity-50">
      <div class="font-bold text-neutral">
        <div class="badge mr-2 mb-1 ${badgeClass}">
          <i class="ri-line-chart-line"></i>${sign}${percentage}%
        </div> from last hour
      </div>  
    </div>
  `;
}
