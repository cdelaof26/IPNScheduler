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
        navigator.clipboard.writeText(copyText.value).then();
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

function copiarEasySelect() {
    copyData("btn3", "easy-select");
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
            courseToolsControllerMode = false;
            addCollectorListeners();
            reloadAllCollectedData();
        } else if (pageName === "configPage") {
            addConfigFieldsListeners();
            reloadConfigData();
        } else if (pageName === "scheduleGenerator") {
            reload_generated_html();
        } else if (pageName === "toolsPage") {
            document.getElementById("easy-select").value = "const table=document.querySelector(\"table[rules]\"),table_parent=table.parentElement,tbody=table.children[0],preferences=[\"Máxima preferencia\",\"Fuertemente preferido\",\"Moderadamente preferido\",\"Moderadamente evitar\",\"Preferentemente evitar\",\"Sin preferencia\"],preferences_values=[-1,0,1,2,3,4];let selection=[];function preference_selector(e,t){const n=document.createElement(\"td\");n.setAttribute(\"style\",\"padding: 1rem;\");const o=document.createElement(\"label\");n.appendChild(o);const d=document.createElement(\"select\");d.addEventListener(\"change\",(e=>t(e))),o.appendChild(d);const r=document.createElement(\"option\");r.setAttribute(\"selected\",!0),r.setAttribute(\"disabled\",!0),r.setAttribute(\"hidden\",!0),d.appendChild(r),r.appendChild(document.createTextNode(e));const c=document.createElement(\"option\");c.setAttribute(\"value\",\"Máxima preferencia\"),d.appendChild(c),c.appendChild(document.createTextNode(\"Máxima preferencia\"));const i=document.createElement(\"option\");i.setAttribute(\"value\",\"Fuertemente preferido\"),d.appendChild(i),i.appendChild(document.createTextNode(\"Fuertemente preferido\"));const l=document.createElement(\"option\");l.setAttribute(\"value\",\"Moderadamente preferido\"),d.appendChild(l),l.appendChild(document.createTextNode(\"Moderadamente preferido\"));const a=document.createElement(\"option\");a.setAttribute(\"value\",\"Sin preferencia\"),d.appendChild(a),a.appendChild(document.createTextNode(\"Sin preferencia\"));const p=document.createElement(\"option\");p.setAttribute(\"value\",\"Moderadamente evitar\"),d.appendChild(p),p.appendChild(document.createTextNode(\"Moderadamente evitar\"));const m=document.createElement(\"option\");return m.setAttribute(\"value\",\"Preferentemente evitar\"),d.appendChild(m),m.appendChild(document.createTextNode(\"Preferentemente evitar\")),n}function append_columns(){let e=document.createElement(\"th\");function t(e){const t=preferences.indexOf(e);return preferences_values[-1===t?0:t]}function n(e){let n=[],o=0;for(let d of e.children)3!==o&&4!==o&&10!==o&&11!==o?(n.push(12!==o?d.textContent:t(d.children[0].children[0].value)),o++):o++;return n.join(\",\")}e.textContent=\"Sel\",tbody.children[0].appendChild(e),e=document.createElement(\"th\"),e.textContent=\"Pref\",tbody.children[0].appendChild(e);let o=!1,d=0;for(let e of tbody.children){if(!o){o=!0;continue}let t=document.createElement(\"td\");const r=document.createElement(\"button\");r.id=d,r.on=!1,r.style=\"margin: 1rem; width: 1rem; height: 1rem; color: white; background-color: #6c1538\",r.onclick=t=>{t.preventDefault(),r.on=!r.on,r.textContent=r.on?\"✓\":\"\",r.on?selection[r.id]=n(e):selection[r.id]=void 0},t.appendChild(r),e.appendChild(t),e.appendChild(preference_selector(\"Seleccionar...\",(()=>{void 0===selection[r.id]&&r.click(),selection[r.id]=n(e)}))),d++}}function strip_schedules(){append_columns(),spawn.style=\"display: none; color: white; background-color: #6c1538; width: 10rem; height: 2rem; position: fixed; bottom: 1rem; left: 1rem;\",document.getElementById(\"mainForm\").style=\"display: none;\";const e=document.createElement(\"div\");e.style=\"display: flex; flex-direction: column; padding: 1rem; background-color: white; width: 100%; height: 100%; z-index: 100\";const t=document.createElement(\"button\");t.onclick=()=>{document.getElementById(\"mainForm\").style=\"\",table_parent.appendChild(table),e.parentElement.removeChild(e);for(let e of tbody.children)e.removeChild(e.children[e.children.length-1]),e.removeChild(e.children[e.children.length-1]);spawn.style=\"color: white; background-color: #6c1538; width: 10rem; height: 2rem; position: fixed; bottom: 1rem; left: 1rem;\"},t.style=\"color: white; background-color: #6c1538; width: 10rem; height: 2rem\",t.textContent=\"Cerrar\";const n=document.createElement(\"button\");n.style=\"color: white; background-color: #6c1538; width: 10rem; height: 2rem\",n.textContent=\"Descargar CSV\",n.onclick=()=>{let e=\"Grupo,Materia,Profesor,Lunes,Martes,Miércoles,Jueves,Viernes,Preferencia\\r\\n\";for(let t=0;t<selection.length;t++)void 0!==selection[t]&&(e+=selection[t]+\"\\r\\n\");const t=document.createElement(\"a\");t.href=\"data:text/csv;charset=utf-8,\"+encodeURIComponent(e);const n=document.getElementsByName(\"ctl00$mainCopy$Filtro$cboTurno\")[0].value,o=document.getElementsByName(\"ctl00$mainCopy$Filtro$lsNoPeriodos\")[0].value;t.download=\"Pref_grupos_turno_\"+n+\"_periodo_\"+o+\".csv\",document.body.appendChild(t),t.click(),document.body.removeChild(t)},document.body.appendChild(n);const o=document.createElement(\"div\");o.style=\"display: flex; justify-content: space-between;\",o.appendChild(t),o.appendChild(n);const d=document.createElement(\"div\");d.style=\"width: fit; height: 100%; padding: 4rem\",d.appendChild(table),e.appendChild(o),e.appendChild(d),document.body.appendChild(e)}const spawn=document.createElement(\"button\");spawn.textContent=\"Presiona ver el selector\",spawn.onclick=()=>strip_schedules(),document.body.appendChild(spawn),strip_schedules();"
            document.getElementById("horarios").value = "const thead = document.querySelectorAll(\"[style*='color:White;background-color:Maroon;font-family:Arial;font-size:X-Small;font-weight:bold;']\")[0].children;const headers = []; for (let th of thead) headers.push(th.textContent);const tbody = document.querySelectorAll(\"[style*='color:#333333;']\");const groups = []; for (let tr of tbody) for (let td of tr.children) groups.push(td.textContent);let csvString = headers + \"\\r\\n\";for (let i = headers.length; i <= groups.length; i += headers.length) csvString += groups.slice(i - headers.length, i) + \"\\r\\n\";const link = document.createElement('a');link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);const turno = document.getElementsByName(\"ctl00$mainCopy$Filtro$cboTurno\")[0].value;const periodo = document.getElementsByName(\"ctl00$mainCopy$Filtro$lsNoPeriodos\")[0].value;link.download = ('Grupos' + '_turno_' + turno + '_periodo_' + periodo) + '.csv';document.body.appendChild(link);link.click();document.body.removeChild(link);";
            document.getElementById("disponibilidad").value = "const thead = document.querySelectorAll(\"[style*='color:White;background-color:#FF9900;font-family:Arial;font-weight:bold;']\")[0].children;const headers = []; for (let th of thead) headers.push(th.textContent);const tbody = document.querySelectorAll(\"[style*='color:#333333;']\");const groups = []; for (let tr of tbody) for (let td of tr.children) groups.push(td.textContent);let csvString = headers + \"\\r\\n\";for (let i = headers.length; i < groups.length; i += headers.length) csvString += groups.slice(i - headers.length, i) + \"\\r\\n\";const link = document.createElement('a');link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);link.download = 'Disponibilidad.csv';document.body.appendChild(link);link.click();document.body.removeChild(link);";

            courseToolsControllerMode = true;
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
