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
    (checkbox) => checkbox.closest("tr").children[data].textContent);
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

if(withoutProtocol.checked) {
  let dataLength = proxies.toString().split(",").length;
  let newDataTxt = "";
  let protocol = localStorage.getItem("type") || "http";
  for(let i = 0; i < dataLength; i++) {
    newDataTxt += `${proxies.toString().split(",")[i].replaceAll(`${protocol}://`,"")}\n`
  }
  dataTxt = newDataTxt
} else {
  dataTxt = proxies.join("\n");
}
  dataJson = {
    proxy:proxies, ip, port, protocol, anonymity, score, country
  }

let fileName = `${protocol[0]}-${ip[0]}-${count}`;
if (textRadio.checked) {
  download(dataTxt, `${fileName}.txt`)
} else if(jsonRadio.checked) {
  download(JSON.stringify(dataJson), `${fileName}.json`)
} else {
  downBtn.innerHTML = "Select File Type";
}
})