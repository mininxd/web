import Chart from "chart.js/auto";

function getHourlyTimes(count) {
  const times = [];
  const now = new Date();
  now.setMinutes(0, 0, 0);

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(now.getHours() - i); 
    times.push(d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }));
  }
  return times;
}



export function makeChart(element, data) {
const highest = Math.max(...data);
const max = Math.round(highest + (highest * 0.25));
const labels = getHourlyTimes(data.length);
  
new Chart(element, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 12
      }]
    },
    options: {
      pointStyle: "rectRounded",
      borderColor: "oklch(55% 0.046 257.417)",
      backgroundColor: "oklch(55% 0.046 257.417)",
      scales: { 
        y: {
          beginAtZero: true,
          max
        },
        x: {
          ticks: {
            display: true
          },
          grid: {
            drawTicks: true
          }
        },
      },
      plugins: {legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            label: ctx => `$${ctx.raw}`
          }
        }
      }
    }
  });
}