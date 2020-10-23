document.addEventListener('DOMContentLoaded', function() {

    document.getElementById("checkPage").addEventListener("click",
        function() {

            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function(response) {

                    var checkPageButton = document.getElementById('rightAnswer');
                    checkPageButton.innerHTML = response.farewell;

                    console.log(response.farewell);
                });
            });

        }, false);

}, false);