var button = document.getElementById("mybutton");
button.addEventListener("click", function() {
  chrome.tabs.executeScript(null, {file: "content_script.js"});
  window.close();
}, false);