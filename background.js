chrome.storage.onChanged.addListener(function () {
    chrome.storage.sync.get(null, function(items) {
        console.log(items);
    });
  });