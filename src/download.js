let proxyCheckbox;
document.addEventListener("change", () => {
  proxyCheckbox = [...document.querySelectorAll(".select:checked")]; 
  
  totalSelect.innerHTML = `selected: ${proxyCheckbox.length}`
  document.querySelectorAll(".select").forEach((el) => {
    el.addEventListener("change", () => {
      selectAll.checked = false;
    })
     if(proxyCheckbox.length >= 1) {
       totalSelect.classList.remove("hidden");
       downBtn.classList.remove("btn-disabled");
     } else {
       totalSelect.classList.add("hidden");
       downBtn.classList.add("btn-disabled");
     }
    });
    
  if(textRadio.checked || jsonRadio.checked) {
    downBtn.innerHTML = "Download";
  }
})

selectAll.addEventListener("change", () => {
    document.querySelectorAll(".select").forEach((item) => {
      item.checked = selectAll.checked;
    });
  });



function getProxyData(data) {
  return proxyCheckbox.map(
    (checkbox) => checkbox.closest("tr").children[data].textContent.trim());
}

function download(data, filename) {
  let blob = new Blob([data], {type: "text/plain"});
      let a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
}














let dataTxt = "";
let dataJson = {};

downBtn.addEventListener("click", () => {
  const proxies = getProxyData(1);
  const ip = getProxyData(2);
  const port = getProxyData(3);
  const protocol = getProxyData(4);
  const anonymity = getProxyData(5);
  const score = getProxyData(6);
  const country = getProxyData(7);
  const count = proxyCheckbox.length;

  if (withoutProtocol.checked) {
    dataTxt = ip.map((value, index) => `${value}:${port[index]}`).join("\n");
  } else {
    dataTxt = proxies.join("\n");
  }
  dataJson = {
    proxy:proxies, ip, port, protocol, anonymity, score, country
  }

const date = new Date().toISOString().slice(0,10);
let fileName = `${protocol[0]}_${count}_${date}`;
if (textRadio.checked) {
  download(dataTxt, `${fileName}.txt`)
} else if(jsonRadio.checked) {
  download(JSON.stringify(dataJson), `${fileName}.json`)
} else {
  downBtn.innerHTML = "Select File Type";
  downBtn.classList.add("btn-disabled");
}
})