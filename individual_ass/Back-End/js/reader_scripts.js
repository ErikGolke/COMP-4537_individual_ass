let quoteNumber = 1;
const http = new XMLHttpRequest();

/**
 * Generates a new form for inputting quiz questions.
 */
function generateForm(quoteText, quoteAuthor, singleQuote=false){
    let template = generateTemplate(quoteNumber, quoteText, quoteAuthor);
    let questionDiv = document.createElement("div");
    questionDiv.setAttribute("class", "transparent");
    questionDiv.setAttribute("class", "quote");
    questionDiv.setAttribute("id", ("quote_" + quoteNumber))
    questionDiv.innerHTML = template;
    if (singleQuote) {
        document.getElementById("quotes").innerHTML = ""
        document.getElementById("quotes").append(questionDiv)
    } else {
        document.getElementById("quotes").append(questionDiv);
    }
}

/**
 * Gets the most recent quote from the database.
 */
function getMostRecent(){
    http.open("GET", "https://www.erikgolke.com/reader/newest")
    http.setRequestHeader('Access-Control-Allow-Headers', '*');
    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader('Access-Control-Allow-Origin', '*');
    http.onload = function () {
        if(http.readyState === http.DONE && http.status === 200) {
            console.log(http.response);
            res = JSON.parse(http.response);
            let authorName = res[0]["author"]
            let quoteText = res[0]["quote"]
            generateForm(authorName, quoteText, true);
        }
    }
    http.send();
}

/**
 * Gets all quotes from the database.
 */
function getAllQuotes(){
    document.getElementById("quotes").innerHTML = ""
    http.open("GET", "https://www.erikgolke.com/reader/all")
    http.setRequestHeader('Access-Control-Allow-Headers', '*');
    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader('Access-Control-Allow-Origin', '*');
    http.onload = function () {
        if(http.readyState === http.DONE && http.status === 200) {
            console.log(http.response);
            res = JSON.parse(http.response);
            res.forEach(element => {
                let authorName = element["author"]
                let quoteText = element["quote"]
                generateForm(authorName, quoteText);
            })

        }
    }
    http.send();
}

/**
 * Template for creating a new quiz question.
 * @returns {string}
 * @param quoteNumber
 */
function generateTemplate(quoteNumber, quoteText, quoteAuthor) {
    return `
         <textarea readonly class="quoteText" id="${quoteNumber}_quote">${quoteText}</textarea>
         <textarea readonly class="quoteAuthor" id="${quoteNumber}_author">${quoteAuthor}</textarea>
    `
}