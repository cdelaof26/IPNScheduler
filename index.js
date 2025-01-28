let pages = [];
let error_count = 0;


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
            error_count = 0;

            window[page2Load.name]();
            scrollToTop();
            loadIcons();
            // pageButtons();

            toggleErrorNotificationVisibility(true);
        }).catch((e) => {
            error_count++;
            toggleErrorNotificationVisibility(false);
            // toggle_loading_indicator_visibility(true);
            document.getElementById("errorCount").textContent = error_count;

            console.error("Error", e);
        });

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
        "classActivities": "files/classActivities.js",
        "purpose": "files/purpose.js",
        "introduction": "files/app_notes/introduction.js"
    }

    let i = 0;
    for (let key in pagesData) {
        pages[i] = new Page(key, pagesData[key]);
        i++;
    }

    pages[0].script_loaded = true;

    loadPage(page).then();
});
