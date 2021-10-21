'use strict';

chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
        if (request.message === "clicked_browser_action") {

            let TTElements = getTTElements();

            let TTTable = createTTTable(TTElements);

            document.body.appendChild(TTTable);

            await navigator.clipboard.writeText(await getFormattedForTableStringFromArray(TTElements));

        }
    }
);


async function getFormattedForTableStringFromArray(array) {

    let resultString = array[0];

    for (let i = 1; i < array.length; i++) {
        resultString += String.fromCodePoint(9) + array[i];
    }

    return resultString;
}

function getTTElements() {

    let loadBlockInfo = document.getElementsByClassName("load-block-info");

    let puDate = getPuDate(loadBlockInfo);

    let loadNumber = getLoadNumber(loadBlockInfo);

    let ref = getRef(loadBlockInfo);

    let customer = getCustomer();

    let addresses = getAddresses(loadBlockInfo);

    let team = getTeam();

    // let rate = getRate(loadBlockInfo);


    let TTElements = [];

    TTElements.push(puDate);
    TTElements.push("");
    TTElements.push(loadNumber);
    TTElements.push(ref);

    TTElements.push("");
    // TTElements.push("");

    TTElements.push(customer);
    // TTElements.push("Carolina Logistics");
    TTElements.push(addresses);
	TTElements.push("");
	TTElements.push("");
	TTElements.push("");
	TTElements.push("");
	TTElements.push("");
	TTElements.push("");
	TTElements.push("");
	TTElements.push("");
	TTElements.push(team);
    // TTElements.push(rate);

    return TTElements;
}

function getTeam() {
    let dispatcher = getDispatcher();

    if (dispatcher === "sync sync") {
        return "Intercompany";
    } else
        return "";
}

function getDispatcher() {
    return getStrongSelectorFromTable(0).textContent;
}

function getRef(loadBlockInfo) {

    let ref = loadBlockInfo[0].querySelector("div.second-link").querySelector("strong");

    return ref.textContent;
}

function getStrongSelectorFromTable(tableIndex) {
    let customer = document.querySelectorAll(".table-responsive")[tableIndex];
    customer = customer.querySelector("strong");

    return customer;
}

function getCustomer() {
    return getStrongSelectorFromTable(1).textContent;
}

function getLoadNumber(loadBlockInfo) {

    let loadNumber = loadBlockInfo[0].querySelector("h2").textContent;

    loadNumber = loadNumber.substring(7);

    return loadNumber;
}

function getAddresses(loadBlockInfo) {

    let pickUp = loadBlockInfo[1].getElementsByClassName("first-pick-up")[0];
    pickUp = getAddress(pickUp);

    let delivery = loadBlockInfo[1].getElementsByClassName("last-delivery")[0];
    delivery = getAddress(delivery);

    return pickUp + " - " + delivery;
}


function getAddress(containingElement) {

    let address = containingElement.querySelector("strong").textContent;

    let counter = 0;
    let position = 0;

    // finding position of 2nd coma to cut string
    while (counter !== 2) {

        if ((position = address.indexOf(",", position)) !== -1) {
            counter++;
        }

        position++;
    }


    address = address.slice(0, position - 1);

    return address;
}


function getPuDate(loadBlockInfo) {

    let date = loadBlockInfo[1].getElementsByClassName("first-pick-up")[0];

    date = date.getElementsByClassName("styles_child__3uVE-")[0];

    date = date.querySelector("div").textContent;

    date = date.slice(0, date.indexOf(String.fromCodePoint(160)));

    return date;
}


function getRate(loadBlockInfo) {

    let rate = loadBlockInfo[0].querySelectorAll("div");


    for (let i = 0; i < rate.length; i++) {

        if (rate[i].textContent) {

            if (rate[i].textContent.includes("Rate: ")) {

                rate = rate[i].textContent.split(" ")[5];

                break;
            }
        }
    }

    return rate;
}


function createTTTable(TTElements) {

    let div = document.createElement("div");

    let myTable = document.createElement("table");

    let myTr = document.createElement("tr");

    for (let i = 0; i < TTElements.length; i++) {
        let th = document.createElement("th");
        th.innerHTML = TTElements[i];

        myTr.appendChild(th);
    }

    myTable.appendChild(myTr);

    div.appendChild(myTable);

    return div;
}