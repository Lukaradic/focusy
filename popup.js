const input = document.getElementById('url-input');
const submitBtn = document.getElementById('form__submit');
const clearListBtn = document.getElementById('clear__list');
const currentUrlBtn = document.getElementById('current__submit');




function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


function setToStorage(string) {
    const id = guidGenerator();
    let obj = {
        id: id,
        value: string,
    }
    chrome.storage.sync.set({[id]: obj})
}

function setCurrentUrlToInput() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const activeTab = tabs[0];
        console.log(activeTab)
        if(input) {
            input.value = activeTab.url;
        }
     });
}


function submitBtnFunction(e) {
    if(!input.value) return;
    e.preventDefault(e);
    setToStorage(input.value);
    input.value = "";
}


submitBtn.addEventListener('click', submitBtnFunction);
clearListBtn.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.storage.sync.clear();
})

currentUrlBtn.addEventListener('click', setCurrentUrlToInput);

