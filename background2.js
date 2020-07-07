(a => {
  //*
  let b = null, C = [];
  const c = () => {
    chrome.tabs.query({
      currentWindow : !0,
      active        : !0
    }, d => {
      b = d[0].id;
    });
  };
  c();
  const getFile = url => {
    let startTime = new Date();
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open("GET", url);
      request.onload = () => {
        if(request.status == 200){
          resolve(request.responseText);
        }else{
          reject(request.statusText);
        };
      };
      request.onerror = () => {
       reject(Error("Network Error"));
     };
     request.send();
   });
  };  
  chrome.webRequest.onBeforeRequest.addListener(e => {
    let f = e.url, g;
    try{
      if(e.requestBody && e.requestBody.raw && e.requestBody.raw[0]) g = decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(e.requestBody.raw[0].bytes)))
      if(b==e.tabId){
        let D = {url : f};
        if(e.method=="POST") D.postPayload = g;
        C.push(D);
      };
    }catch(h){
      console.log(h.message);
    };
  }, {urls : ["<all_urls>"]}, ["requestBody"]);

  chrome.tabs.onActivated.addListener(c);
  //*/

  //*background2.js cannot initiate a message but can respond and content2.js receives the response, it hears messages from both content2.js and duckface2.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    sendResponse({});
  });
  //*/
})(window);
