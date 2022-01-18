const body = document.querySelector('body')
// const toBlock = chrome.storage.sync.get

// body.innerHTML = "<h1 class="main-text"> Site has been blocked, stay focused on your task </h1>";

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
    let blockedUrlArr
    blockedUrlArr = await getUrlData().then((items) => items.list)
    let currentUrl = window.location.href

    blockedUrlArr.forEach((item) => {
        if (currentUrl.includes(item.value)) {
            body.innerHTML = ''
            console.log('blocked site')
            return
        }
    })
}

checkBlockedUrl();
//  on storage change check if url is added
// chrome.storage.onChanged.addListener(checkBlockedUrl)

