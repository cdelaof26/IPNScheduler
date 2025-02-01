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
    i.className = 'h-12 lg:h-16';
    i.setAttribute('id', 'previous');
    button.appendChild(i);
    div.appendChild(button);

    let div0 = document.createElement('div');
    div0.className = 'flex flex-col justify-center';

    let p = document.createElement('p');
    p.className = 'self-center text-sm lg:text-base';
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
                loadPage(nextPageName).then();
                return;
            }

            setError(goNextError);
        };
    else
        button2.setAttribute("class", "invisible");

    let i3 = document.createElement('i');
    i3.className = 'h-12 lg:h-16' + (nextPageName === null ? " invisible" : "");
    i3.setAttribute('id', 'next');
    button2.appendChild(i3);
    div.appendChild(button2);
    pageButtons.replaceWith(div);
    div.id = 'pageButtons'
}

function copyData(btnId, dataId) {
    const btn = document.getElementById(btnId);

    const copyText = document.getElementById(dataId);
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    try {
        navigator.clipboard.writeText(copyText.value);
        btn.classList.add("text-white");
        btn.classList.add("bg-ipn-0");
        document.getElementById(btnId + "Text").textContent = "¡Copiado!";
        setTimeout(() => {
            btn.classList.remove("text-white");
            btn.classList.remove("bg-ipn-0");
            document.getElementById(btnId + "Text").textContent = "Copiar";
        }, 1500);
    } catch (e) {
        console.error(e);
        document.getElementById(btnId + "Text").textContent = "Error :(";
        setTimeout(() => {
            document.getElementById(btnId + "Text").textContent = "Copiar";
        }, 1500);
    }
}

function copiarHorariosScript() {
    copyData("btn1", "horarios");
}

function copiarDisponibilidadScript() {
    copyData("btn2", "disponibilidad");
}

function createCookie(page) {
    const date = new Date();
    date.setTime(date.getTime() + (20 * 24 * 60 * 60 * 1000));
    let expires = "expires="+ date.toUTCString();

    // TODO: Uncomment for production
    if (page === "configPage" || page === "scheduleGenerator")
        page = "dataCollector";

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
    if (hide) {
        document.getElementById("errorPopup").classList.add("hidden");
        errorCount = 0;
    } else {
        document.getElementById("errorPopup").classList.remove("hidden");
        errorCount++;
    }

    document.getElementById("errorCount").textContent = errorCount;
}

function setError(msg) {
    toggleErrorNotificationVisibility(false);
    document.getElementById("errorMsg").textContent = msg;
}

function toggleNavButtonSelection(buttonToHighlight) {
    for (let i = 0; i < 5; i++) {
        const b = document.getElementById(`nav${i}`);
        b.classList.remove("border-ipn-0");
        b.classList.remove("border-transparent");
        b.classList.add(i === buttonToHighlight ? "border-ipn-0" : "border-transparent");
    }
}

class Page {
    name;
    reference;
    script_loaded;

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
        nextPage = "scheduleGenerator";
        reloadData = true;
    } else if (pageName === "scheduleGenerator") {
        title = "Generador de horarios";
        progress = "3";
        buttonToHighlight = 0;
        previousPage = "configPage";
    } else if (pageName === "operationInfo")
        buttonToHighlight = 1;
    else if (pageName === "helpPage")
        buttonToHighlight = 2;
    else if (pageName === "developer")
        buttonToHighlight = 3;
    else if (pageName === "toolsPage") {
        buttonToHighlight = 4;
        reloadData = true;
    }

    window[pageName]();
    scrollToTop();
    showPageButtons(title, progress, previousPage, nextPage);
    loadIcons();
    toggleNavButtonSelection(buttonToHighlight);

    if (reloadData)
        if (pageName === "dataCollector") {
            addCollectorListeners();
            reloadAllCollectedData();
        } else if (pageName === "configPage") {
            addConfigFieldsListeners();
            reloadConfigData();
        } else if (pageName === "toolsPage") {
            document.getElementById("horarios").value = "const thead = document.querySelectorAll(\"[style*='color:White;background-color:Maroon;font-family:Arial;font-size:X-Small;font-weight:bold;']\")[0].children;const headers = []; for (let th of thead) headers.push(th.textContent);const tbody = document.querySelectorAll(\"[style*='color:#333333;']\");const groups = []; for (let tr of tbody) for (let td of tr.children) groups.push(td.textContent);let csvString = headers + \"\\r\\n\";for (let i = headers.length; i < groups.length; i += headers.length) csvString += groups.slice(i - headers.length, i) + \"\\r\\n\";const link = document.createElement('a');link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);const turno = document.getElementsByName(\"ctl00$mainCopy$Filtro$cboTurno\")[0].value;const periodo = document.getElementsByName(\"ctl00$mainCopy$Filtro$lsNoPeriodos\")[0].value;link.download = ('Grupos' + '_turno_' + turno + '_periodo_' + periodo) + '.csv';document.body.appendChild(link);link.click();document.body.removeChild(link);";
            document.getElementById("disponibilidad").value = "const thead = document.querySelectorAll(\"[style*='color:White;background-color:#FF9900;font-family:Arial;font-weight:bold;']\")[0].children;const headers = []; for (let th of thead) headers.push(th.textContent);const tbody = document.querySelectorAll(\"[style*='color:#333333;']\");const groups = []; for (let tr of tbody) for (let td of tr.children) groups.push(td.textContent);let csvString = headers + \"\\r\\n\";for (let i = headers.length; i < groups.length; i += headers.length) csvString += groups.slice(i - headers.length, i) + \"\\r\\n\";const link = document.createElement('a');link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);link.download = 'Disponibilidad.csv';document.body.appendChild(link);link.click();document.body.removeChild(link);";
            addToolsListeners();
            reloadToolsData();
        }

    toggleErrorNotificationVisibility(true);
}

async function loadPage(pageName) {
    if (generatorRunning) {
        setError("No es posible cambiar página mientras se ejecuta generar");
        return;
    }

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
            setError("Ocurrió un error al cargar la página");
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
        "scheduleGenerator": "files/scheduleGenerator.js",
        "operationInfo": "files/operationInfo.js",
        "developer": "files/developer.js",
        "helpPage": "files/helpPage.js",
        "toolsPage": "files/toolsPage.js",
    }

    let i = 0;
    for (let key in pagesData) {
        pages[i] = new Page(key, pagesData[key]);
        i++;
    }

    pages[0].script_loaded = true;

    loadPage(page).then();
});
