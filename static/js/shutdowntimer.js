console.log("shutdowntimer.js loaded");
const windows = document.querySelector(".fa-windows");
const windows_btn = document.querySelector(".btn-outline-primary");
windows_btn.onclick = function () {
  windows.className = "fas fa-arrow-down";
};
