const input = document.getElementById('url-input')

const urlList = document.getElementById('url__list')

const submitBtn = document.getElementById('form__submit')
const clearListBtn = document.getElementById('clear__list')
const currentUrlBtn = document.getElementById('current__submit')
const disableBtn = document.getElementById('btn__disable');
const enableBtn = document.getElementById('btn__enable');


function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return (
        S4() +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        S4() +
        S4()
    )
}

async function renderUrlListData() {
    let urlListArr = await getUrlData().then((items) => items.list)
    if (!urlList) return
    urlList.innerHTML = ''
    urlListArr.forEach((item) => {
        let li = createElement('li', item.value, ['list__item'], item.id)
        let deleteBtn = createElement('button', 'delete', [
            'btn',
            'list__btn',
            'list__btn--delete',
        ])

        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault()
            removeFromStorage(item.id)
        })
        li.appendChild(deleteBtn)
        urlList.appendChild(li)
    })
}

async function setToStorage(string) {
    const id = guidGenerator()
    let obj = {
        id: id,
        value: string,
    }
    chrome.storage.sync.get(function (cfg) {
        if (
            typeof cfg['list'] !== 'undefined' &&
            cfg['list'] instanceof Array
        ) {
            cfg['list'].push(obj)
        } else {
            cfg['list'] = [obj]
        }
        chrome.storage.sync.set(cfg)
    })
}
function removeFromStorage(id) {
    chrome.storage.sync.get(function (items) {
        items['list'] = items['list'].filter((url) => url.id !== id)
        chrome.storage.sync.set(items)
    })
}

function setCurrentUrlToInput(e) {
    e.preventDefault();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0]
        if (input) {
            input.value = activeTab.url
        }
    })
}

function submitBtnFunction(e) {
    if (!input.value) return
    e.preventDefault(e)
    setToStorage(input.value)
    input.value = ''
}

function enableAllUrls() {
    chrome.storage.sync.set({'disable' : false})
}

function disableAllUrls() {
    chrome.storage.sync.set({'disable' : true})
}

function getUrlData() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('list', (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError)
            }
            resolve(items)
        })
    })
}

function createElement(element = 'div', text = '', classes, id) {
    let node = document.createElement(element)
    node.textContent = text
    node.classList.add(...classes)
    if (id) node.setAttribute('id', id)
    return node
}


submitBtn?.addEventListener('click', submitBtnFunction)
clearListBtn?.addEventListener('click', (e) => {
    e.preventDefault()
    chrome.storage.sync.clear()
})
currentUrlBtn?.addEventListener('click', setCurrentUrlToInput)
disableBtn?.addEventListener('click', disableAllUrls);
enableBtn?.addEventListener('click', enableAllUrls);


chrome.storage.onChanged.addListener(renderUrlListData)
renderUrlListData();
