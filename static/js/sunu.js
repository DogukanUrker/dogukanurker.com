console.log("sunu.js loaded");
const skip = document.querySelector(".full-screen-container");
var pageNumber = 0;
skip.onclick = function () {
    if pageNumber===5 {
        window.scrollTo(0,0)
    }
    else{
        window.scrollTo(500,0)
        pageNumber++;
    }
  
};
