/* --- content.js (ULTIMATE TITLE/DESCRIPTION WIDTH FIX) --- */

if (typeof browser === "undefined") {
    var browser = chrome;
}

const CUSTOM_WIDE_ATTRIBUTE = 'custom-wide';
const MARGIN_BOTTOM_PX = 16; 

// ------------------------------------------------------------------
// --- DOM Positioning Function (Unmodified) ---
// ------------------------------------------------------------------

function setSecondaryPosition() {
    const playerContainer = document.querySelector("#player-container-inner");
    const secondary = document.querySelector("#secondary");
    const filterBar = secondary ? secondary.querySelector("ytd-rich-grid-renderer") : null;
    
    if (playerContainer && secondary) {
        const playerHeight = playerContainer.offsetHeight;
        const playerControlBuffer = 50; 
        const filterBarHeight = filterBar ? filterBar.offsetHeight + 8 : 0; 
        
        const newTop = playerHeight + playerControlBuffer + MARGIN_BOTTOM_PX + filterBarHeight; 

        secondary.style.position = 'absolute';
        secondary.style.top = `${newTop}px`;
        secondary.style.right = '0px'; 
        secondary.style.marginTop = '0'; 

        console.log(`Secondary position set: top=${newTop}px (Player: ${playerHeight}px, Buffer: ${playerControlBuffer}px, Filter: ${filterBarHeight}px)`);
        return true;
    }
    return false;
}


// ------------------------------------------------------------------
// --- Core Fix Functions (CSS: Final Metadata Constraint) ---
// ------------------------------------------------------------------

function applyCustomWideViewStyles() {
    const STYLE_ID = "custom-wide-view-styles";
    const existingStyle = document.getElementById(STYLE_ID);
    if (existingStyle) {
        existingStyle.remove();
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    
    style.textContent = `
        /* 1. Global Scroll Fix & Layout Reset */
html, body, ytd-app {
    overflow: unset !important;
    overflow-y: scroll !important;
    background-color: var(--yt-spec-general-background-a) !important;
}

/* 2. Primary Layout Normalization */
ytd-watch-flexy[custom-wide] #primary {
    width: 100% !important;
    max-width: none !important;
    overflow: unset !important;
    padding: 0 !important;
    margin: 0 !important;
    position: relative !important;
}

ytd-watch-flexy[custom-wide] #columns {
    width: 100% !important;
    max-width: none !important;
    display: block !important;
    padding-top: 0 !important;
}

/* ABOVE-THE-FOLD WIDTH FIX */
ytd-watch-flexy[custom-wide] #above-the-fold {
    width: 72% !important;
    max-width: 72% !important;
    padding-left: 24px !important;
    padding-right: 32px !important;
    margin: 0 !important;
    display: block !important;
    box-sizing: border-box !important;
}

/* BELOW-THE-FOLD WIDTH FIX */
ytd-watch-flexy[custom-wide] #below-the-fold {
    width: 72% !important;
    max-width: 72% !important;
    padding-left: 24px !important;
    padding-right: 32px !important;
    margin: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    display: block !important;
    box-sizing: border-box !important;
}

/* Metadata container */
ytd-watch-flexy[custom-wide] ytd-watch-metadata {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
}

ytd-watch-flexy[custom-wide] #below-the-fold #below-the-fold-container {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box !important;
}

/* ================================
   FIX AI OVERVIEW + GAME NAME WIDTH
   ================================ */
ytd-watch-flexy[custom-wide] #always-shown,
ytd-watch-flexy[custom-wide] #always-shown > *,
ytd-watch-flexy[custom-wide] #expandable-metadata,
ytd-watch-flexy[custom-wide] #expandable-metadata > * {
    width: 72% !important;
    max-width: 72% !important;
    padding-left: 24px !important;
    padding-right: 32px !important;
    margin: 0 !important;
    box-sizing: border-box !important;
}

/* COMMENTS WIDTH */
ytd-watch-flexy[custom-wide] ytd-comments {
    width: 72% !important;
    max-width: 72% !important;
    padding-left: 24px !important;
    padding-right: 32px !important;
    margin: 0 !important;
    display: block !important;
    box-sizing: border-box !important;
}

ytd-watch-flexy[custom-wide] #description.ytd-watch-flexy {
    margin: 0 !important;
    padding: 0 !important;
}

/* SECONDARY COLUMN */
ytd-watch-flexy[custom-wide] #secondary {
    width: 25% !important;
    max-width: 25% !important;
    padding-top: 0 !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    z-index: 10 !important;
}

ytd-watch-flexy[custom-wide] #secondary #items {
    display: block !important;
    width: 100% !important;
    overflow: unset !important;
}

/* PLAYER SIZING */
ytd-watch-flexy[custom-wide] #player-container-inner.ytd-watch-flexy {
    margin: 0 auto !important;
    max-width: 100% !important;
    background-color: #000 !important;
    padding-top: 56.25% !important;
    height: 0 !important;
    position: relative !important;
}

ytd-watch-flexy[custom-wide] #movie_player {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
}

/* --- FIX: ID Chips width matches main content --- */
ytd-watch-flexy[custom-wide] ytd-feed-filter-chip-bar-renderer {
    width: 72% !important;
    max-width: 72% !important;
    padding-left: 24px !important;
    padding-right: 32px !important;
    margin: 0 !important;
    box-sizing: border-box !important;
    display: block !important;
}

/* --- FIX: Remove double scrollbars --- */
html, body {
    overflow: auto !important;
    overflow-x: hidden !important;
}

ytd-app {
    overflow: visible !important;
}

#primary, #secondary, ytd-watch-flexy {
    overflow: visible !important;
}


    `;
    document.head.appendChild(style);
    console.log("Custom Wide View: Styles injected.");
    return true;
}

// ------------------------------------------------------------------
// --- Activation and Deactivation Functions (Unmodified) ---
// ------------------------------------------------------------------

function revertToDefault() {
    const STYLE_ID = "custom-wide-view-styles";
    const existingStyle = document.getElementById(STYLE_ID);
    if (existingStyle) {
        existingStyle.remove();
    }
    
    const secondary = document.querySelector("#secondary");
    if (secondary) {
        secondary.style.position = '';
        secondary.style.top = '';
        secondary.style.right = '';
        secondary.style.marginTop = '';
    }
    
    const watchFlex = document.querySelector('ytd-watch-flexy');
    if (watchFlex) {
         watchFlex.removeAttribute(CUSTOM_WIDE_ATTRIBUTE);
         document.body.style.overflow = '';
         document.documentElement.style.overflow = '';
    }
    console.log("Custom Wide View: MODE DEACTIVATED.");
    return true;
}

function activateCustomWideView() {
     const watchFlex = document.querySelector('ytd-watch-flexy');
     if (!watchFlex) return false;
     
     watchFlex.setAttribute(CUSTOM_WIDE_ATTRIBUTE, '');
     applyCustomWideViewStyles();
     
     setTimeout(setSecondaryPosition, 100); 
     
     watchFlex.removeAttribute('is-theater-mode'); 
     document.body.style.overflow = '';
     document.documentElement.style.overflow = '';
     console.log("Custom Wide View: MODE ACTIVATED.");
     
     return true;
}

function deactivateCustomWideView() {
     return revertToDefault();
}

// --------------------------------------------
// --- Popup Message Listener & Default Setting Check (Unmodified) ---
// --------------------------------------------

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let success = false;
    
    if (request.action === 'ACTIVATE') {
        success = activateCustomWideView(); 
    } else if (request.action === 'DEACTIVATE') {
        success = deactivateCustomWideView();
    }
    
    sendResponse({ success: success });
    return true; 
});

async function checkDefaultSetting() {
    if (!window.location.href.includes('/watch')) return;
    
    try {
        const result = await browser.storage.local.get(["customWideModeDefault"]);
        if (result.customWideModeDefault) {
            setTimeout(activateCustomWideView, 1000); 
        }
    } catch (error) {
        console.error("Error checking default setting:", error);
    }
}

checkDefaultSetting();
window.addEventListener('yt-page-data-updated', checkDefaultSetting);