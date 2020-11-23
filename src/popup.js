document.addEventListener('DOMContentLoaded', function() {

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function(response) {
            var checkPageButton = document.getElementById('rightAnswer');
            checkPageButton.innerHTML = response.farewell;
        });
    });

}, false);