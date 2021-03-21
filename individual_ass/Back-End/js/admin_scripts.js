let quoteNumber = 1; // Tracks current question number.
let quotes = new Map(); // Holds JSON objects representing quiz questions and answers.
const http = new XMLHttpRequest();
let clicks = new Map();

/**
 * Generates a new form for inputting quiz questions.
 */
function generateForm(){
    let template = generateTemplate(quoteNumber);
    let questionDiv = document.createElement("div");
    questionDiv.setAttribute("class", "transparent");
    questionDiv.setAttribute("class", "quote");
    questionDiv.setAttribute("id", ("quote_" + quoteNumber))
    questionDiv.innerHTML = template;
    document.getElementById("quotes").appendChild(questionDiv);
    clicks.set("quote_" + quoteNumber, false);
    document.getElementById(quoteNumber + "_update").addEventListener('click', function() {
        addToDb(this.id);
    })
    document.getElementById(quoteNumber + "_delete").addEventListener('click', function() {
        deleteQuote(this.id);
    })
    quoteNumber++;
}

/**
 * Deletes a quote from the DOM
 * @param id id of quote to delete
 */
function deleteQuote(id){
    num = id.split("_")[0];
    quotes.delete("quote_" + num);
    console.log(quotes)
    quoteDiv = document.getElementById("quote_" + num);
    quoteDiv.remove();
}

/**
 * Updates DB with all questions on page.
 */
function updateDB() {
    let jsonPayload = []
    quoteDivs = document.querySelectorAll(".quote");
    quoteDivs.forEach(element => {
        let authorName = element.querySelector(".quoteText").value
        let quoteText = element.querySelector(".quoteAuthor").value
        jsonPayload.push({author: authorName, quote: quoteText})
    })
    http.open("POST", "https://www.erikgolke.com/admin/updateDB")
    http.setRequestHeader('Access-Control-Allow-Headers', '*');
    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader('Access-Control-Allow-Origin', '*');
    http.send(JSON.stringify(jsonPayload));
    console.log(quotes)
}

/**
 * Adds quote to the db.
 * @param id of quote to add.
 */
function addToDb(id) {
    num = id.split("_")[0];
    if(clicks.get("quote_" + num) === true){
        return
    }
    let quote = document.getElementById(num + "_quote").value
    let author = document.getElementById(num + "_author").value
    let json = {"author" : author, "quote": quote};
    quotes.set("quote_" + num, json);
    http.open("POST", "https://www.erikgolke.com/admin/add")
    http.setRequestHeader('Access-Control-Allow-Headers', '*');
    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader('Access-Control-Allow-Origin', '*');
    http.send(JSON.stringify(json));
    clicks.set("quote_" + num, true);
}

/**
 * Template for creating a new quiz question.
 * @returns {string}
 * @param quoteNumber
 */
function generateTemplate(quoteNumber) {
    return `
         <textarea placeholder="Inspirational Quote" class="quoteText" id="${quoteNumber}_quote"></textarea>
         <textarea placeholder="Quote Author" class="quoteAuthor" id="${quoteNumber}_author"></textarea>
         <button id="${quoteNumber}_delete">delete</button>
         <button id="${quoteNumber}_update">Add to DB</button>
    `
}