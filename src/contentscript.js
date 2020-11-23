chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if (request.greeting == "hello") {
            let list = document.all;

            for (let item of list) {

                if (item.innerHTML.indexOf("function checkQuestions") !== -1) {

                    let funcAsString = getFuncSrcFromInnerHtml(item.innerHTML);

                    let rightAnswer = getRightAnswerFromFuncSrc(funcAsString);

                    let convertedRightAnswer = unicodeToChar(rightAnswer);

                    let beauty = beautify(convertedRightAnswer);

                    sendResponse({ farewell: beauty });

                    break;
                }
            }

        }
    });

function getFuncSrcFromInnerHtml(innerHTML) {
    let startIndex = innerHTML.indexOf("function checkQuestions");
    let midIndex = innerHTML.indexOf("return 1", startIndex);
    let endIndex = innerHTML.indexOf("}", midIndex);

    return innerHTML.substring(startIndex, endIndex);
}

function getRightAnswerFromFuncSrc(input) {
    let startIndex = input.indexOf(" == '") + 5;
    let endIndex = input.indexOf("'", startIndex);
    return input.substring(startIndex, endIndex);
}

function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
        function(match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
}

function beautify(input) {
    let array = input.split(",");
    let result = "";
    for (let item of array) {
        result += "<p>" + item + "</p>";
    }
    return result;
}