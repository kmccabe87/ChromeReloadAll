document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  const reloadButton = document.getElementById("reloadNow");
  const autoToggle = document.getElementById("autoToggle");
  const autoInterval = document.getElementById("autoInterval");
  const whitelistTextarea = document.getElementById("whitelist");
  const saveWhitelistButton = document.getElementById("saveWhitelist");

  // Load saved settings
  chrome.storage.sync.get(
    ["autoReloadEnabled", "autoReloadInterval", "whitelist"],
    (data) => {
      autoToggle.checked = data.autoReloadEnabled || false;
      autoInterval.value = data.autoReloadInterval || 5;
      whitelistTextarea.value = (data.whitelist || []).join("\n");
    }
  );

  // Reload button click
  reloadButton.addEventListener("click", () => {
    status.textContent = "Reloading...";
    chrome.storage.sync.get(["whitelist"], (data) => {
      chrome.runtime.sendMessage(
        { action: "reload", whitelist: data.whitelist || [] },
        (response) => {
          status.textContent = "Done!";
        }
      );
    });
  });

  // Auto-reload toggle
  autoToggle.addEventListener("change", () => {
    const enabled = autoToggle.checked;
    const interval = parseInt(autoInterval.value) || 5;
    chrome.storage.sync.set({ autoReloadEnabled: enabled, autoReloadInterval: interval });
    chrome.runtime.sendMessage(
      { action: "setAutoReload", enabled, interval },
      (response) => {
        status.textContent = enabled ? "Auto-reload enabled" : "Auto-reload disabled";
      }
    );
  });

  // Auto-reload interval change
  autoInterval.addEventListener("change", () => {
    if (autoToggle.checked) {
      const interval = parseInt(autoInterval.value) || 5;
      chrome.storage.sync.set({ autoReloadInterval: interval });
      chrome.runtime.sendMessage(
        { action: "setAutoReload", enabled: true, interval },
        (response) => {
          status.textContent = "Auto-reload interval updated";
        }
      );
    }
  });

  // Save whitelist
  saveWhitelistButton.addEventListener("click", () => {
    const whitelist = whitelistTextarea.value.split("\n").filter((line) => line.trim());
    chrome.storage.sync.set({ whitelist });
    chrome.runtime.sendMessage(
      { action: "updateWhitelist", whitelist },
      (response) => {
        status.textContent = "Whitelist saved!";
      }
    );
  });
});