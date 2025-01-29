let pages = [];
let errorCount = 0;
let allowGoNextFunc = () => true;
let goNextError = "";

function showPageButtons(title, progress, previousPageName, nextPageName) {
    let pageButtons = document.querySelector('div#pageButtons');
    if (pageButtons === null || pageButtons === undefined)
        return;

    let div = document.createElement('div');
    div.className = 'flex justify-between';

    let button = document.createElement('button');
    if (previousPageName !== null && previousPageName !== undefined)
        button.onclick = () => loadPage(previousPageName);
    else
        button.setAttribute("class", "invisible");

    let i = document.createElement('i');
    i.className = 'h-16';
    i.setAttribute('id', 'previous');
    button.appendChild(i);
    div.appendChild(button);

    let div0 = document.createElement('div');
    div0.className = 'flex flex-col justify-center';

    let p = document.createElement('p');
    p.className = 'self-center';
    p.textContent = title;
    div0.appendChild(p);

    let p1 = document.createElement('p');
    p1.className = 'self-center';
    p1.textContent = `${progress}/3`;
    div0.appendChild(p1);
    div.appendChild(div0);

    let button2 = document.createElement('button');
    if (nextPageName !== null && nextPageName !== undefined)
        button2.onclick = () => {
            if (allowGoNextFunc()) {
                loadPage(nextPageName);
                return;
            }

            setError(goNextError);
        };
    else
        button2.setAttribute("class", "invisible");

    let i3 = document.createElement('i');
    i3.className = 'h-16' + (nextPageName === null ? " invisible" : "");
    i3.setAttribute('id', 'next');
    button2.appendChild(i3);
    div.appendChild(button2);
    pageButtons.replaceWith(div);
    div.id = 'pageButtons'
}

function createCookie(page) {
    const date = new Date();
    date.setTime(date.getTime() + (20 * 24 * 60 * 60 * 1000));
    let expires = "expires="+ date.toUTCString();

    document.cookie = "ipnscheduler=" + page + ";" + expires + ";";
}

function scrollToTop() {
    let user_agent = window.navigator.userAgent;

    if (user_agent.match(/iPad/i) || user_agent.match(/iPhone/i))
        // https://stackoverflow.com/questions/24616322/mobile-safari-why-is-window-scrollto0-0-not-scrolling-to-0-0
        setTimeout(() => {
            window.scroll({top: -1, left: 0, behavior: "smooth"});
        }, 10);
    else
        document.getElementById('main_container').scroll({ top: 0, behavior: 'smooth' });
}


function toggleErrorNotificationVisibility(hide) {
    if (hide)
        document.getElementById("errorPopup").classList.add("hidden");
    else
        document.getElementById("errorPopup").classList.remove("hidden");
}

function setError(msg) {
    errorCount++;
    toggleErrorNotificationVisibility(false);
    document.getElementById("errorMsg").textContent = msg;
}

function toggleNavButtonSelection(buttonToHighlight) {
    for (let i = 0; i < 4; i++) {
        const b = document.getElementById(`nav${i}`);
        b.classList.remove("border-ipn-0");
        b.classList.remove("border-transparent");
        b.classList.add(i === buttonToHighlight ? "border-ipn-0" : "border-transparent");
    }
}

function get_width() {
    // Function extracted from: https://stackoverflow.com/questions/1038727/how-to-get-browser-width-using-javascript-code
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

class Page {
    constructor(name, reference) {
        this.name = name;
        this.reference = reference;
        this.script_loaded = false;
    }

    load_page_script() {
        // Function extracted from: https://stackoverflow.com/questions/13121948/dynamically-add-script-tag-with-src-that-may-include-document-write
        return new Promise((resolve, reject) => {
            const script_element = document.createElement('script');
            script_element.setAttribute('src', this.reference);
            script_element.addEventListener('load', resolve);
            script_element.addEventListener('error', reject);
            document.body.appendChild(script_element);
        });
    }
}

function load(pageName) {
    let title = "";
    let progress = "";
    let buttonToHighlight = 0;
    let previousPage = undefined;
    let nextPage = undefined;
    let reloadData = false;

    allowGoNextFunc = () => true;
    if (pageName === "info") {
        title = "Introducción a IPN-Scheduler";
        progress = "0";
        buttonToHighlight = 0;
        nextPage = "dataCollector";
    } else if (pageName === "dataCollector") {
        title = "Clases, profesores y horas";
        progress = "1";
        buttonToHighlight = 0;
        previousPage = "info";
        nextPage = "configPage";
        reloadData = true;
    } else if (pageName === "configPage") {
        title = "Parámetros de configuración";
        progress = "2";
        buttonToHighlight = 0;
        previousPage = "dataCollector";
        reloadData = true;
    } else if (pageName === "operationInfo")
        buttonToHighlight = 1;
    else if (pageName === "developer")
        buttonToHighlight = 3;

    window[pageName]();
    scrollToTop();
    showPageButtons(title, progress, previousPage, nextPage);
    loadIcons();
    toggleNavButtonSelection(buttonToHighlight);

    if (reloadData)
        if (pageName === "dataCollector") {
            reloadAllCollectedData();
        } else if (pageName === "configPage") {
            addConfigFieldsListeners();
            reloadConfigData();
        }

    toggleErrorNotificationVisibility(true);
}

async function loadPage(pageName) {
    createCookie(pageName);

    let page2Load = null;

    for (let i = 0; i < pages.length; i++)
        if (pageName === pages[i].name)
            page2Load = pages[i];

    if (page2Load === null)
        return;

    if (!page2Load.scriptLoaded)
        await page2Load.load_page_script().then(() => {
            page2Load.scriptLoaded = true;
            errorCount = 0;

            load(pageName);
        }).catch((e) => {
            errorCount++;
            toggleErrorNotificationVisibility(false);
            // toggle_loading_indicator_visibility(true);
            document.getElementById("errorCount").textContent = errorCount;

            console.error("Error", e);
        });
    else
        load(pageName);
    // if (get_width() < 700) {
}


document.addEventListener("DOMContentLoaded", () => {
    let cookie = document.cookie;

    let page = "info";
    if (cookie.length === 0)
        createCookie(page);
    else
        page = cookie.split("=")[1];

    const pagesData = {
        "info": "files/info.js",
        "dataCollector": "files/dataCollector.js",
        "configPage": "files/configPage.js",
        "operationInfo": "files/operationInfo.js",
        "developer": "files/developer.js"
    }

    let i = 0;
    for (let key in pagesData) {
        pages[i] = new Page(key, pagesData[key]);
        i++;
    }

    pages[0].script_loaded = true;

    loadPage(page).then();
});
