let block;
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

async function checkBlockedUrl() {
    if (!block) return
    let blockedUrlArr
    blockedUrlArr = await getUrlData().then((items) => items.list)
    let currentUrl = window.location.href

    blockedUrlArr.forEach((item) => {
        if (currentUrl.includes(item.value)) {
            ;``
            const body = document.querySelector('body')
            body.innerHTML = ''
        }
    })
}
//  on storage change check if url is added
chrome.storage.onChanged.addListener(() => {
    chrome.storage.sync.get((items) => {
        block = items['disable']
        checkBlockedUrl()
    })
})

function getBlockValue() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('disable', items => {
            if(chrome.runtime.lastError) return reject(chrome.runtime.lastError)
            resolve(items)
        }) 
    })
}

async function mount() {
    block = await getBlockValue().then(value => value['disable'])
    checkBlockedUrl();
}

mount();