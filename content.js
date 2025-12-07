/* --- content.js (ULTIMATE TITLE/DESCRIPTION WIDTH FIX) --- */

if (typeof browser === "undefined") {
    var browser = chrome;
}

const CUSTOM_WIDE_ATTRIBUTE = 'custom-wide';
const MARGIN_BOTTOM_PX = 16; 

// ------------------------------------------------------------------
// --- DOM Positioning Function (Unmodified) ---
// ------------------------------------------------------------------

function getScaleFactor(screenWidth) {
    if (screenWidth >= 2560) {
        return 1.03;
    } else if (screenWidth > 1920) {
        return 1.05 + ((2560 - screenWidth) / 9000); // Use same formula everywhere!
    } else if (screenWidth === 1920) {
        return 1.09 + ((2560 - screenWidth) / 6400); // Use same formula everywhere!
    } else if (screenWidth >= 1600) {
        return 1.15;
    } else if (screenWidth >= 1366) {
        return 1.22;
    } else {
        return 1.27;
    }
}

function setSecondaryPosition() {
    const player = document.querySelector("#player");
    const secondary = document.querySelector("#secondary");
    const filterBar = secondary ? secondary.querySelector("ytd-rich-grid-renderer") : null;
    
    if (player && secondary) {
        // Get the actual visual bounds of the scaled player
        const playerRect = player.getBoundingClientRect();
        const playerBottom = playerRect.bottom;
        
        // Calculate position relative to page top
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const absoluteBottom = playerBottom + scrollTop;
        
        const playerControlBuffer = 50; 
        const filterBarHeight = filterBar ? filterBar.offsetHeight + 8 : 0;
        
        // Add a bit of extra spacing
        const extraSpacing = -60; // Adjust this to fine-tune
        
        const newTop = absoluteBottom + playerControlBuffer + MARGIN_BOTTOM_PX + filterBarHeight + extraSpacing;

        secondary.style.position = 'absolute';
        secondary.style.top = `${newTop}px`;
        secondary.style.right = '0px'; 
        secondary.style.marginTop = '0'; 

        console.log(`Secondary positioned at ${newTop}px (Player bottom: ${absoluteBottom}px)`);
        return true;
    }
    return false;
}

// ------------------------------------------------------------------
// --- Core Fix Functions (CSS: Final Metadata Constraint) ---
// ------------------------------------------------------------------

// For the title margin, slightly reduce the percentage for 1080p
function applyCustomWideViewStyles() {
    const STYLE_ID = "custom-wide-view-styles";
    const existingStyle = document.getElementById(STYLE_ID);
    if (existingStyle) {
        existingStyle.remove();
    }

    const screenWidth = window.innerWidth;
    const scaleValue = getScaleFactor(screenWidth);

    const counterScale = 1 / scaleValue;
    const compensateWidth = scaleValue * 100;
    
    // Calculate margin based on player height
    const playerContainer = document.querySelector("#player-container-inner");
    let marginBottom = 100; // Default fallback
    
    if (playerContainer) {
        const playerHeight = playerContainer.offsetHeight;
        const scaledPlayerHeight = playerHeight * scaleValue;
        
        // Adjust percentage based on screen size
        // I HAVE NO CLUE WHAT IM DOING IM GOING INSANE WITH THIS SCALING SHIT
        // NOTHING MAKES SENSE ANYMORE
        let marginPercentage;
        if (screenWidth >= 2560) {
            marginPercentage = 0.20; // 1440p - keep at 10%
        } else if (screenWidth > 1920) {
            marginPercentage = 0.04; // Between 1440p and 1080p
        } else if (screenWidth === 1920) {
            marginPercentage = 0.06; // Between 1440p and 1080p
        } else {
            marginPercentage = 0.12; // 1080p and smaller - reduce to 8%
        }
        
        marginBottom = Math.round((scaledPlayerHeight * marginPercentage) + 50);
    }
    
    console.log(`Screen: ${screenWidth}px, Scale: ${scaleValue}, Margin: ${marginBottom}px`);

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

ytd-watch-flexy[custom-wide] .ytp-chrome-bottom {
    transform: scale(${counterScale}) !important;
    transform-origin: left center !important;
    width: 100% !important;
}

ytd-watch-flexy[custom-wide] #player {
    transform: scale(${scaleValue}) !important;
    transform-origin: top center !important;
    margin-bottom: ${marginBottom}px !important;
}

/* ABOVE-THE-FOLD WIDTH FIX */
ytd-watch-flexy[custom-wide] #above-the-fold {
    width: 78% !important;
    max-width: 78% !important;
    padding-left: 24px !important;
    padding-right: 32px !important;
    margin: 0 !important;
    display: block !important;
    box-sizing: border-box !important;
}

/* BELOW-THE-FOLD WIDTH FIX */
ytd-watch-flexy[custom-wide] #below-the-fold {
    width: 78% !important;
    max-width: 78% !important;
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

/* Hide the Theater Mode button completely */
ytd-watch-flexy[custom-wide] .ytp-size-button {
    display: none !important;
}


/* ================================
   FIX AI OVERVIEW + GAME NAME WIDTH
   ================================ */
ytd-watch-flexy[custom-wide] #always-shown,
ytd-watch-flexy[custom-wide] #always-shown > *,
ytd-watch-flexy[custom-wide] #expandable-metadata,
ytd-watch-flexy[custom-wide] #expandable-metadata > * {
    width: 78% !important;
    max-width: 78% !important;
    padding-left: 24px !important;
    padding-right: 32px !important;
    margin: 0 !important;
    box-sizing: border-box !important;
}

/* COMMENTS WIDTH */
ytd-watch-flexy[custom-wide] ytd-comments {
    width: 78% !important;
    max-width: 78% !important;
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
    width: 19% !important;
    max-width: 19% !important;
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
    width: 78% !important;
    max-width: 78% !important;
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

    // Safety check (fix for undefined browser.storage)
    if (!browser || !browser.storage || !browser.storage.local) {
        console.warn("Storage API not ready, retrying...");
        setTimeout(checkDefaultSetting, 300);
        return;
    }

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

// ----------------------------------------------------------
// Disable custom-wide mode when entering Theater or Fullscreen
// ----------------------------------------------------------
// ----------------------------------------------------------
// Disable custom-wide mode when entering Theater or Fullscreen
// ----------------------------------------------------------
// ------------------------------------------------------------------
// Auto-disable custom mode for Theater Mode + Fullscreen
function monitorPlayerModes() {
	let lastPlayer = null;
	let observer = null;

	function attachObserver() {
		const player = document.querySelector("#movie_player");
		if (!player) return;

		// Avoid re-attaching
		if (lastPlayer === player) return;
		lastPlayer = player;

		if (observer) observer.disconnect();

		observer = new MutationObserver(() => {
			const isFullscreen = !!document.fullscreenElement || player.classList.contains("ytp-fullscreen");

			if (isFullscreen) {
				console.log("AUTO RESET: Fullscreen detected.");
				deactivateCustomWideView();
			} else {
				// Reactivate if default is enabled
				if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
					browser.storage.local.get(["customWideModeDefault"]).then(result => {
						if (result.customWideModeDefault) {
							console.log("AUTO REACTIVATE: Fullscreen exited, normal mode detected.");
							activateCustomWideView();
						}
					}).catch(err => console.error(err));
				}
			}
		});

		// Observe class changes for fullscreen
		observer.observe(player, { attributes: true, attributeFilter: ["class"] });
	}

	// Listen for browser fullscreen events
	document.addEventListener("fullscreenchange", () => {
		const player = document.querySelector("#movie_player");
		if (!player) return;

		const isFullscreen = !!document.fullscreenElement || player.classList.contains("ytp-fullscreen");

		if (isFullscreen) {
			console.log("AUTO RESET: Fullscreen triggered.");
			deactivateCustomWideView();
		} else {
			if (typeof browser !== "undefined" && browser.storage && browser.storage.local) {
				browser.storage.local.get(["customWideModeDefault"]).then(result => {
					if (result.customWideModeDefault) {
						console.log("AUTO REACTIVATE: Fullscreen exited, normal mode detected.");
						activateCustomWideView();
					}
				}).catch(err => console.error(err));
			}
		}
	});

	// Watch for DOM rebuilds (YouTube often replaces elements)
	if (document.body instanceof Node) {
		new MutationObserver(() => attachObserver()).observe(document.body, { childList: true, subtree: true });
	}

	// Initial attach
	attachObserver();
}

// Run the monitor
monitorPlayerModes();
