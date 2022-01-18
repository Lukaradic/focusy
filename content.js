const body = document.querySelector('body');

// body.innerHTML = "<h1 class="main-text"> Site has been blocked, stay focused on your task </h1>";


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

async function checkBlockedUrl() {
    let blockedUrlArr;
    blockedUrlArr = await getUrlData();
    let currentUrl = window.location.href;
    console.log(currentUrl, blockedUrlArr);
    for(let url in blockedUrlArr) {
        if(currentUrl.includes(blockedUrlArr[url].value)) {
            body.innerHTML = "";
            console.log('blocked site')
            return;
        }
    }
};

checkBlockedUrl();