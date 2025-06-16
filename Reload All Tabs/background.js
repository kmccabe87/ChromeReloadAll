// Core reload function (no delay)
function reloadTabs(filter = {}) {
  chrome.tabs.query(filter, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.reload(tab.id); // Instant reload
    });
    // Feedback after reload
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon128.png",
      title: "Tab Reloader",
      message: "All selected tabs have been reloaded!"
    });
    const audio = new Audio("complete.mp3");
    audio.play();
    chrome.storage.sync.get(["totalReloads"], (data) => {
      const newCount = (data.totalReloads || 0) + 1;
      chrome.storage.sync.set({ totalReloads: newCount });
      chrome.action.setBadgeText({ text: newCount.toString() });
      chrome.action.setBadgeBackgroundColor({ color: "#00FF00" });
    });
  });
}

// Helper function to apply whitelist if set
function reloadWithWhitelist() {
  chrome.storage.sync.get(["whitelist"], (data) => {
    const filter = data.whitelist?.length
      ? { url: data.whitelist.map((domain) => `*://${domain}/*`) }
      : {};
    reloadTabs(filter);
  });
}

// Context menu
chrome.contextMenus.create({
  id: "reload-all",
  title: "Reload All Tabs",
  contexts: ["all"]
});

// Toolbar click
chrome.action.onClicked.addListener(() => {
  reloadWithWhitelist();
});

// Shortcut key
chrome.commands.onCommand.addListener((command) => {
  if (command === "reload-all-tabs") {
    reloadWithWhitelist();
  }
});

// Context menu click
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "reload-all") {
    reloadWithWhitelist();
  }
});

// Auto-reload via alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "reloadTabs") {
    chrome.storage.sync.get(["autoReloadEnabled", "whitelist"], (data) => {
      if (data.autoReloadEnabled) {
        const filter = data.whitelist?.length
          ? { url: data.whitelist.map((domain) => `*://${domain}/*`) }
          : {};
        reloadTabs(filter);
      }
    });
  }
});

// Handle popup messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "reload") {
    const filter = message.whitelist?.length
      ? { url: message.whitelist.map((domain) => `*://${domain}/*`) }
      : {};
    reloadTabs(filter);
    sendResponse({ status: "reload started" });
  } else if (message.action === "setAutoReload") {
    if (message.enabled && message.interval > 0) {
      chrome.alarms.create("reloadTabs", { periodInMinutes: message.interval });
    } else {
      chrome.alarms.clear("reloadTabs");
    }
    sendResponse({ status: "auto-reload updated" });
  } else if (message.action === "updateWhitelist") {
    sendResponse({ status: "whitelist updated" });
  }
  return true; // Keep message channel open for async response
});

// Initialize badge
chrome.storage.sync.get(["totalReloads"], (data) => {
  if (data.totalReloads) {
    chrome.action.setBadgeText({ text: data.totalReloads.toString() });
    chrome.action.setBadgeBackgroundColor({ color: "#00FF00" });
  }
});