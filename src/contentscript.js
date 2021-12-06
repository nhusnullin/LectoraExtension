chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if (request.greeting == "hello") {
            let list = document.all;

            for (let item of list) {

                if (item.innerHTML.indexOf("function checkQuestions") !== -1) {

                    let funcAsString = getFuncSrcFromInnerHtml(item.innerHTML);
                    let rightAnswer = getRightAnswerFromFuncSrc(funcAsString);

                    if (rightAnswer == "func") {
                        // that means that format is changed and answer in separate span
                        let answer = findCorrectAnswerSpan();
                        sendResponse({ farewell: answer });
                    } else {
                        let convertedRightAnswer = unicodeToChar(rightAnswer);

                        highlightAndSubmitAnswers(convertedRightAnswer);

                        let beauty = beautify(convertedRightAnswer);

                        sendResponse({ farewell: beauty });
                    }

                    break;
                }
            }

        }
    });

function highlightAndSubmitAnswers(input) {
    let array = input.split(",");

    for (let item of array) {
        highlightAndSubmitAnswer(item);
    }

    highlightAndSubmitAnswer(input);
}

function findCorrectAnswerSpan() {

    var list = ["All the options are correct", "The correct answer"];
    for (let input of list) {
        var span = getContainsAnswerSpan(input);
        if (span) {
            return span.innerHTML;
        }
    }
    return "The correct answer is not found";
}

function highlightAndSubmitAnswer(input) {
    var encodedItem = htmlCodeToChar(input);

    var span = getAnswerSpan(encodedItem);
    if (span && span.parentElement) {
        span.parentElement.style.backgroundColor = 'green';
        span.parentElement.setAttribute('class', 'correctAnswerStyle')
    }

    var input = getAnswerInput(encodedItem);
    if (input) {
        input.click();
    }
}

function getContainsAnswerSpan(searchText) {
    var spanTags = document.getElementsByTagName("span");
    var found;

    for (let span of spanTags) {
        if (span.innerHTML.indexOf(searchText) !== -1) {
            found = span;
            break;
        }
    }

    return found;
}

function getAnswerSpan(searchText) {
    var spanTags = document.getElementsByTagName("span");
    var found;

    for (let span of spanTags) {
        if (span.innerText == searchText) {
            found = span;
            break;
        }
    }

    return found;
}

function getAnswerInput(searchText) {
    var inputTags = document.getElementsByTagName("input");
    var found;

    for (let input of inputTags) {
        if (input.value == searchText) {
            found = input;
            break;
        }
    }

    return found;
}

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

function htmlCodeToChar(text) {
    return text.replace(/&#[\d]+/gi,
        function(match) {
            return String.fromCharCode(parseInt(match.replace(/&#/g, '')));
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