function reindex(obj) {
  const newObj = {};
  Object.values(obj).forEach((item, index) => {
    newObj[index] = item;
  });
  return newObj;
}

function deleteSticker(items) {
  let obj = JSON.parse(localStorage.getItem("stickerStorage")) || {};
  try {
    items.forEach(({ id, item }) => {
      for (const key in obj) {
        if (key === id && obj[key].nama === item) {
          delete obj[key];
          break;
        }
      }
    });
    obj = reindex(obj);
    localStorage.setItem("stickerStorage", JSON.stringify(obj));

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
try {
  const delItemArr = [];
  
itemListToDelete.querySelectorAll('li input[type="checkbox"]:checked').forEach(checkbox => {
  const id = checkbox.value.split(".qris.")[0];
  const item = checkbox.value.split(".qris.")[1];
  delItemArr.push({ id, item });
  deleteSticker(delItemArr)
  setTimeout(() => {
  window.location.reload();
  },750);
  });
} catch(e) {
  console.log(e)
}
});