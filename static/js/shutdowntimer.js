const windows = document.querySelector(".fa-windows")
const linux = document.querySelector(".fa-linux")
const windows_btn = document.querySelector(".btn-outline-primary")
const linux_btn = document.querySelector(".btn-outline-warning")
linux_btn.onclick = function(){
    linux.className = "fas fa-arrow-down";
}
windows_btn.onclick = function(){
    windows.className = "fas fa-arrow-down"
}