(a => {
  //* Receives messages initiated by popup and responses from background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const b = JSON.parse(document.getElementById("logData").innerHTML.replace(/^\/\//, ""));
    const c = message.rule;
    let D;
    const E = "background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAIAAAD9MqGbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFNSURBVDhPY/hPLhjkOvfv219VUXH+3HkIF4vOSxcvTp44MTIs3MPFtbmxsaigMDkhkZeTiwEM+Ll5YqOijx87hqKzvbVNiI+fh4NTREBQSkxcWlxCVFAIqNrM2OTokaP37t79/v07VCnczon9/YK8fCL8AooyssryChCkKCsnKyl19swZiBo0wHDq5ClJUTGgwVysbHyc3ApIOuWlZfS0tKEKMQDUzh8/frx9+/bZ06cSIqIK0jIQnUpy8hzMLBAFmAA9hIBeF+YTAOqBaOZkYYVKYAAsYWuoqycnJQ2xk52JGSqKAbDodHZwlJGQBOoEhpAgDx9UFANg0Tl18mRhPn6gTqB+Z3sHqCgGwKITCAS4eYAWAmP/xfPnUCEMgF1nalKyML8AO+6ABQLsOoFAW10TqBnKwQZw6vzw4QMw0UI52ABOnQQBuTr//wcAng5zdjL4M8cAAAAASUVORK5CYII=');background-repeat:no-repeat";
    if(c){
      if(b[c]){
        D = b[c];
      }else{
        Object.keys(b).map(d => {
          if(b[d].name == c) D = b[d];
        });
      };
      if(D){
        console.group(`%c   ${c}`, E);
          console.groupCollapsed(`%ctable`, "font-style:italic;font-weight:normal");
            console.table(D);
          console.groupEnd();
          (function F(G){
            if(G.constructor===Function) console.log(G.toString());
            if(G.constructor===String)   console.log(`"${G}"`);
            if(G.constructor===Number)   console.log(G);
            if(G.constructor===Array){
              if(G.length == 0){
                                         console.log("[empty]");
              }else{
                G.map((H, I) => {
                  const J = /^rule\s(triggered|completed)$/.test(H)      ? "green" :
                            /^rule\s(action|condition)\sfailed$/.test(H) ? "red"   : null;
                  if(J == null){
                    console.group(I);
                      if(H.constructor===Array || H.constructor===Object){
                        console.groupCollapsed("%ctable", "font-style:italic;font-weight:normal");
                          console.table(H);
                        console.groupEnd();
                      };
                      F(H);
                    console.groupEnd();
                  }else{
                    console.log(`%c  %c ${H}`, `background-color:${J}`, "background-color: transparent");
                  };
                });
              };
            };
            if(G.constructor===Object){
              let K = Object.getOwnPropertyNames(G);
              if(K.length == 0){
                                         console.log("{empty}");
              }else{
                K.map(H => {
                  if(H == "id" || H == "name"){
                    console.log(`%c${H}%c: "${G[H]}"`, "font-weight:bold", "font-weight:normal");
                  }else{
                    console[H == "log" ? "group" : "groupCollapsed"](
                      `%c${H}`,
                      `color:#${Object.keys(G).indexOf(H) >= 0 ? "000" : "777"}` + (H == "log" ? `;font-style:italic;font-weight:normal` : ``)
                    );
                      if(G[H].constructor===Array || G[H].constructor===Object){
                        console.groupCollapsed("%ctable", "font-style:italic;font-weight:normal");
                          console.table(G[H]);
                        console.groupEnd();
                      };
                      F(G[H]);
                    console.groupEnd();
                  };
                });
              };
            };
          })(D);
        console.groupEnd();
      }else{
        console.log("%c   No rule with this name or id has interacted with Launch monitoring API", E);
      };
    };
    sendResponse({
      rule : D
    });
  });
  //*/
  const e = a.document.createElement("script");
  const f = a.document.createTextNode([
    "let g = {};",
    "const h = (i, j) => {",
      "const k = i.rule, l = k.id;",
      "g[l] = g[l] || JSON.parse(JSON.stringify(k));",
      "g[l].log = g[l].log || [];",
      "g[l].log.push(j);",
      "window.launchLog = g;",
      "const m = document.createElement('script');",
      "const n = document.createTextNode('//' + JSON.stringify(g));",
      "const o = document.getElementsByTagName('head')[0];",
      "const p = document.getElementById('logData');",
      "if(p) p.parentNode.removeChild(p);",
      "m.type='text/javascript';",
      "m.id='logData';",
      "m.appendChild(n);",
      "o.appendChild(m);",
    "};",
    //Aaron Hardy @Adobe: https://medium.com/adobetech/launch-library-monitoring-hooks-c674d16deae3
    "window._satellite = window._satellite || {};",
    "window._satellite._monitors = window._satellite._monitors || [];",
    "window._satellite._monitors.push({",
      "ruleTriggered:       q => h(q, 'rule triggered'),",
      "ruleCompleted:       q => h(q, 'rule completed'),",
      "ruleActionFailed:    q => h(q, 'rule action failed'),",
      "ruleConditionFailed: q => h(q, 'rule condition failed')",
    "});",
  ].join("\n"));
  e.type = "text/javascript";
  e.appendChild(f);//does nothing until the script is appended to the document
  //Corbin Spicer @Tealium: MutationObservers work as the DOM is building before DOMready, even inside the head
  new MutationObserver(r => r.map(s => {
    const t = s.addedNodes;
    if(t && t.length==1){
      const u = t[0];
      /*
      afterend - right after Launch tag, i.e. after closing tag
      afterbegin - nested inside Launch tag, i.e. after opening tag
      beforeend -  nested inside Launch tag, i.e. before closing tag
      beforebegin - right before Launch tag, i.e before opening tag <- we need that one

      look for the mutation that is adding the main script element for Adobe Launch
      insert the hooks inline script above just before the Adobe Launch script
      */
      if(u && u.nodeName=="SCRIPT" && /^https:\/\/assets\.adobedtm\.com\/launch-/.test(u.src)) u.insertAdjacentElement("beforebegin", e);
    };
  })).observe(document.documentElement, {
    childList: !0,//immediate children of the HTML document
    subtree:   !0//any deeper descendents such as inside the head, body, etc
  });
  /* Send message, background2.js receives and responds. duckface2.js receives but only responds to messages it has initiated
  try{
    chrome.runtime.sendMessage({

    }, response => {
      console.log("response", response);
    });
  }catch(err){
    console.log(1);
  };
  //*/
})(window);
