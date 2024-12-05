function reindex(obj) {
  const newObj = {};
  Object.keys(obj).forEach((_, index) => {
    const key = Object.keys(obj)[index];
    newObj[index] = obj[key];
  });
  return newObj;
}


try {
let obj = JSON.parse(localStorage.getItem("stickerStorage")) || {};
let reindexedObj = reindex(obj);
for(let i = 0; i < Object.keys(obj).length; i++) {
  if(!obj[i]) {
    localStorage.setItem("stickerStorage", JSON.stringify(reindexedObj));
   setTimeout(() => {
    window.location.reload();
   }, Math.round(Object.keys(obj).length * 120))
  }
}
} catch(e) {
  
}


async function deleteSticker(items) {
  let obj = JSON.parse(localStorage.getItem("stickerStorage")) || {};
  try {
  await items.forEach(({ id, item }) => {
      if (obj[id] && obj[id].nama === item) {
        delete obj[id];
      }
    })
    localStorage.setItem("stickerStorage", JSON.stringify(reindex(obj)));
    window.location.reload();
  } catch (e) {
    console.log(e);
  }
}



if(!JSON.parse(localStorage.getItem("stickerStorage"))) {
 console.log() 
} else {

let stickerData = JSON.parse(localStorage.getItem("stickerStorage"));
let stickerLength = JSON.stringify(Object.keys(stickerData).length);

for (let i = 0; i < Number(stickerLength); i++) {
const li = document.createElement('li');

const input = document.createElement('input');
input.classList.add('is-hidden');
input.id = `delItem${i}`;
input.value = `${i}.qris.${stickerData[i].nama}`;
input.type = 'checkbox';

const label = document.createElement('label');
label.setAttribute('for', `delItem${i}`);

const div = document.createElement('div');
div.classList.add('deleteListItem', 'is-fullwidth');

const span1 = document.createElement('span');
span1.classList.add('delItem');
span1.textContent = `${stickerData[i].nama}   `;

const span2 = document.createElement('span');
span2.classList.add('delItem');
span2.textContent = `Rp${Number(stickerData[i].harga).toLocaleString("id-ID")}`;


div.appendChild(span1);
div.appendChild(span2);
label.appendChild(div);
li.appendChild(input);
li.appendChild(label);


input.addEventListener("input", () => {
  
})


itemListToDelete.appendChild(li);
}
}



deleteItemBtn.addEventListener('click', () => {
  deleteItemBtn.classList.add("is-loading");
  setTimeout(() => {
  deleteItemBtn.classList.remove("is-loading");
  },1000)
try {
  const delItemArr = [];


itemListToDelete.querySelectorAll('li input[type="checkbox"]:checked').forEach(checkbox => {
  const id = checkbox.value.split(".qris.")[0];
  const item = checkbox.value.split(".qris.")[1];
  delItemArr.push({ id, item });
  deleteSticker(delItemArr);
})
} catch(e) {
  console.log(e)
}
});