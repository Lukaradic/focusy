const input = document.getElementById("url-input");
const submitBtn = document.getElementById("form__submit");
// const clearListBtn = document.getElementById('clear__list');
const currentUrlBtn = document.getElementById("current__submit");
const urlList = document.getElementById("url__list");

function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

function setToStorage(string) {
  const id = guidGenerator();
  let obj = {
    id: id,
    value: string,
  };
  chrome.storage.sync.set({ [id]: obj });
}

function removeFromStorage(id) {
  chrome.storage.sync.remove(id);
} 

function setCurrentUrlToInput() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    console.log(activeTab);
    if (input) {
      input.value = activeTab.url;
    }
  });
}

function submitBtnFunction(e) {
  if (!input.value) return;
  e.preventDefault(e);
  setToStorage(input.value);
  input.value = "";
  renderUrlListData();
}

submitBtn.addEventListener("click", submitBtnFunction);
// clearListBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     chrome.storage.sync.clear();
// })
currentUrlBtn.addEventListener("click", setCurrentUrlToInput);

//  render list items out of all urls

function getUrlData() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(items);
    });
  });
}

async function renderUrlListData() {
  let urlListArr = await getUrlData().then((items) => items);
  if(!urlList || !!urlListArr.length) return;
  urlList.innerHTML = "";
  for(let url in urlListArr) {
    let li = document.createElement('li');
    li.classList.add('list__item');
    li.textContent = urlListArr[url].value;
    li.setAttribute('id', urlListArr[url].id)


    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'list__btn', 'list__btn--delete');
    deleteBtn.addEventListener('click', e => {
      e.preventDefault();
      console.log(urlListArr[url].id);
    })
    deleteBtn.textContent = 'Delete'
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      removeFromStorage(urlListArr[url].id)
      renderUrlListData();
    })
    li.appendChild(deleteBtn)
    urlList.appendChild(li);
  }
}

renderUrlListData();
