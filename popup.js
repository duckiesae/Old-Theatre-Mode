// Function to update the status text in the popup
function updateStatus(message, isError = false) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.style.color = isError ? 'red' : '#666';
    }
}

// Function to send a message to the active tab's content script
function sendMessageToContent(action, callback) {
    updateStatus('Sending command...');
    const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

    browserAPI.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs.length === 0) {
            updateStatus('Error: No active tab found.', true);
            return;
        }
        
        // Send the message to content.js
        browserAPI.tabs.sendMessage(tabs[0].id, { action: action }, (response) => {
            if (browserAPI.runtime.lastError) {
                updateStatus('Error: Not on a YouTube page or script failed.', true);
                return;
            }
            callback(response && response.success);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Hook up the activation button
    document.getElementById('activateButton').addEventListener('click', () => {
        sendMessageToContent('ACTIVATE', (success) => {
            updateStatus(success ? 'Wide Mode Activated!' : 'Activation Failed.', !success);
        });
    });

    // 2. Hook up the deactivation button
    document.getElementById('deactivateButton').addEventListener('click', () => {
        sendMessageToContent('DEACTIVATE', (success) => {
            updateStatus(success ? 'Layout Reverted.' : 'Revert Failed.', !success);
        });
    });

    // 3. Default Setting Logic
    const defaultCheckbox = document.getElementById('defaultSetting');
    const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
    
    // Load saved state
    browserAPI.storage.local.get(['customWideModeDefault'], (result) => {
        defaultCheckbox.checked = !!result.customWideModeDefault;
    });

    // Save state on change
    defaultCheckbox.addEventListener('change', () => {
        browserAPI.storage.local.set({ customWideModeDefault: defaultCheckbox.checked }, () => {
            updateStatus('Default setting saved.');
        });
    });
});