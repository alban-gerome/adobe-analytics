(() => {
  if(localStorage.rule) document.getElementById("rule").value = localStorage.rule;
    document.getElementById("submit").addEventListener("click", () => {// sends a message to content2.js when I submit, default is when popup opens
    const rule = document.getElementById("rule").value;
    localStorage.setItem("rule", rule);
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {
        rule : rule
      }, response => {
        console.log(response);
      });
    });
  });
  document.getElementById("reset").addEventListener("click", () => {
    document.getElementById("rule").value = "";
    localStorage.removeItem("rule");
  });  
  chrome.runtime.sendMessage({// sends a message to background2.js gets a response from background2.js

  }, response => {
    console.log(response);
  });
})();
