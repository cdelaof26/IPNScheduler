let pages = [];
let errorCount = 0;
let allowGoNextFunc = () => true;
let goNextError = "";
let clean_error = true;
let previousPageName = undefined, currentPageName = "info", nextPageName = undefined;
let menuVisible = false;

// TODO: Set to true for production
const enforce_page_validation = true;

function loadNextPage() {
    if (nextPageName === null || nextPageName === undefined)
        return;

    if (allowGoNextFunc()) {
        loadPage(nextPageName).then();
        return;
    }

    setError(goNextError);
}

function loadPreviousPage() {
    if (previousPageName !== null && previousPageName !== undefined)
        loadPage(previousPageName).then();
}

function toggle_hour_input_help_page_styles(evt) {
    const element_id = evt.target.value === "free" ? "free-hours" : "escom-hours";
    const element_id_1 = evt.target.value === "free" ? "escom-hours" : "free-hours";

    const e = document.getElementById(element_id);
    const e1 = document.getElementById(element_id_1);

    e.classList.add("bg-ipn-0");
    e.children[0].classList.add("text-white", "font-bold");
    e1.classList.remove("bg-ipn-0");
    e1.children[0].classList.remove("text-white", "font-bold");
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

    if (enforce_page_validation)
        if (page === "configPage" || page === "scheduleGenerator")
            page = "info";

    document.cookie = "ipnscheduler=" + page + ";" + expires + ";";
}

function scrollToTop() {
    let user_agent = window.navigator.userAgent;

    if (user_agent.match(/iPad/i) || user_agent.match(/iPhone/i))
        // https://stackoverflow.com/questions/24616322/mobile-safari-why-is-window-scrollto0-0-not-scrolling-to-0-0
        setTimeout(() => {
            window.scroll({top: -1, left: 0, behavior: "smooth"});
        }, 10);
}


function toggleErrorNotificationVisibility(hide) {
    if (!clean_error) {
        clean_error = true;
        return;
    }

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

function toggleMenuVisibility(visible) {
    menuVisible = visible;
    const menu = document.getElementById("menu");
    if (visible)
        menu.classList.remove("scale-0");
    else
        menu.classList.add("scale-0");
}

function toggleNavButtonSelection(buttonToHighlight) {
    toggleMenuVisibility(false);
    for (let i = 0; i < 5; i++) {
        const b = document.getElementById(`nav${i}`);
        if (i === buttonToHighlight) {
            b.classList.add("bg-ipn-0", "text-white", "w-full", "md:w-48");
            b.classList.remove("md:w-16");
            b.children[0].classList.remove("md:size-8");
            b.children[0].classList.add("md:size-6");
            b.children[1].classList.remove("md:hidden");
            continue;
        }

        b.classList.remove("bg-ipn-0", "text-white", "w-full", "md:w-48");
        b.classList.add("md:w-16");
        b.children[0].classList.add("md:size-8");
        b.children[0].classList.remove("md:size-6");
        b.children[1].classList.add("md:hidden");
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
    if (currentPageName !== "info" && pageName === currentPageName)
        return;

    previousPageName = undefined;
    nextPageName = undefined;
    let buttonToHighlight = 0;
    let reloadData = false;

    allowGoNextFunc = () => true;

    const nav_logo = document.getElementById("logo-div").children[1];
    if (pageName === "info")
        nav_logo.classList.add("invisible");
    else
        nav_logo.classList.remove("invisible");

    if (pageName === "info") {
        buttonToHighlight = 0;
        nextPageName = "dataCollector";
    } else if (pageName === "dataCollector") {
        buttonToHighlight = 0;
        previousPageName = "info";
        nextPageName = "configPage";
        reloadData = true;
    } else if (pageName === "configPage") {
        buttonToHighlight = 0;
        previousPageName = "dataCollector";
        nextPageName = "scheduleGenerator";
        reloadData = true;
    } else if (pageName === "scheduleGenerator") {
        buttonToHighlight = 0;
        previousPageName = "configPage";
        reloadData = true;
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
    currentPageName = pageName;
    scrollToTop();
    toggleNavButtonSelection(buttonToHighlight);

    if (reloadData)
        if (pageName === "dataCollector") {
            addCollectorListeners();
            reloadAllCollectedData();
        } else if (pageName === "configPage") {
            addConfigFieldsListeners();
            reloadConfigData();
        } else if (pageName === "scheduleGenerator") {
            reload_generated_html();
        } else if (pageName === "toolsPage") {
            document.getElementById("horarios").value = "const thead = document.querySelectorAll(\"[style*='color:White;background-color:Maroon;font-family:Arial;font-size:X-Small;font-weight:bold;']\")[0].children;const headers = []; for (let th of thead) headers.push(th.textContent);const tbody = document.querySelectorAll(\"[style*='color:#333333;']\");const groups = []; for (let tr of tbody) for (let td of tr.children) groups.push(td.textContent);let csvString = headers + \"\\r\\n\";for (let i = headers.length; i <= groups.length; i += headers.length) csvString += groups.slice(i - headers.length, i) + \"\\r\\n\";const link = document.createElement('a');link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);const turno = document.getElementsByName(\"ctl00$mainCopy$Filtro$cboTurno\")[0].value;const periodo = document.getElementsByName(\"ctl00$mainCopy$Filtro$lsNoPeriodos\")[0].value;link.download = ('Grupos' + '_turno_' + turno + '_periodo_' + periodo) + '.csv';document.body.appendChild(link);link.click();document.body.removeChild(link);";
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

    if (enforce_page_validation) {
        if (pageName === "configPage" || pageName === "scheduleGenerator")
            if (!is_collected_data_valid()) {
                setError(goNextError);
                clean_error = false;
                pageName = "dataCollector";
            }

        if (pageName === "scheduleGenerator")
            if (!is_config_data_valid()) {
                setError(goNextError);
                clean_error = false;
                pageName = "configPage";
            }
    }

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

    document.body.addEventListener("click", (evt) => {
        if (!document.getElementById("nav").contains(evt.target))
            toggleMenuVisibility(false);
    });
});
