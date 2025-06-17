const websiteId = "__WEBSITE_ID__";
const visitUrl = `https://f857-2409-40f0-40c7-6b01-b125-24da-4caf-a0ed.ngrok-free.app/api/visit/${websiteId}`;
const closeBaseUrl = `https://f857-2409-40f0-40c7-6b01-b125-24da-4caf-a0ed.ngrok-free.app/api/visit/${websiteId}/close`;
const VISIT_ID_STORAGE_KEY = "website_visit_id";
const HEARTBEAT_INTERVAL_MS = 60 * 1000;

let currentVisitID = "";
let heartbeatInterval = null;

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return "Mobile";
  if (/tablet/i.test(ua)) return "Tablet";
  return "Desktop";
}

function startHeartbeat(visitId) {
  if (heartbeatInterval) clearInterval(heartbeatInterval);

  heartbeatInterval = setInterval(() => {
    const heartbeatUrl = `${closeBaseUrl}/${visitId}`;
    fetch(heartbeatUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "heartbeat",
        timestamp: new Date().toISOString(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Heartbeat error: ${res.status}`);
        console.log(`Heartbeat sent for ${visitId}`);
      })
      .catch((err) => console.error("Heartbeat error:", err));
  }, HEARTBEAT_INTERVAL_MS);

  console.log(`Heartbeat started for ${visitId}`);
}

function createNewVisit() {
  const postData = {
    deviceType: getDeviceType(),
    action: "visit",
  };

  fetch(visitUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Visit error: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      currentVisitID = data.id;
      localStorage.setItem(VISIT_ID_STORAGE_KEY, currentVisitID);
      sessionStorage.setItem("active_session", "true");
      console.log("New visit created:", currentVisitID);
      startHeartbeat(currentVisitID);
    })
    .catch((err) => console.error("Visit creation error:", err));
}

// On window load
window.onload = () => {
  console.log("Page loaded");

  const storedVisitID = localStorage.getItem(VISIT_ID_STORAGE_KEY);
  const isSameTabSession = sessionStorage.getItem("active_session");

  if (storedVisitID && isSameTabSession) {
    currentVisitID = storedVisitID;
    console.log("Continuing existing session with visit ID:", currentVisitID);
    startHeartbeat(currentVisitID);
  } else {
    console.log("New session detected. Creating new visit.");
    createNewVisit();
  }
};

// On tab close / unload
window.addEventListener("beforeunload", () => {
  const visitId = localStorage.getItem(VISIT_ID_STORAGE_KEY);
  if (!visitId) return;

  const navType =
    performance.getEntriesByType("navigation")[0]?.type || "navigate";

  if (navType === "reload") {
    console.log("Page is reloading. Not removing visit ID.");
    return; // Don't clear visit on reload
  }

  // If not reload (i.e., tab close or direct navigation), clean up
  navigator.sendBeacon(
    `${closeBaseUrl}/${visitId}`,
    JSON.stringify({
      action: "close",
      timestamp: new Date().toISOString(),
    })
  );

  localStorage.removeItem(VISIT_ID_STORAGE_KEY);
  sessionStorage.removeItem("active_session");
  clearInterval(heartbeatInterval);
});

//tract routing changes
function trackRouteChange(path) {
  if (!currentVisitID) return;

  fetch(`${visitUrl}/${currentVisitID}/route`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      route: path,
      timestamp: new Date().toISOString(),
    }),
  }).catch((err) => console.error("Route track error:", err));
}

function monitorRouteChanges() {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    setTimeout(() => {
      trackRouteChange(window.location.pathname);
    }, 0);
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    setTimeout(() => {
      trackRouteChange(window.location.pathname);
    }, 0);
  };

  window.addEventListener("popstate", () => {
    trackRouteChange(window.location.pathname);
  });

  // Initial route
  trackRouteChange(window.location.pathname);
}

window.addEventListener("load", () => {
  monitorRouteChanges();
});
