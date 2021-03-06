(function(obj){
  console.log("Please wait...");
  var a = {}, k, l = 0, m = 0, o, p, q, r = {};
  function cutTable(){
    for(k in a){
      if(obj.showNotFiredOnly==!0    && a[k] && a[k]["Conditions Met?"]==!0) delete a[k];
      if(obj.showNotFiredOnly==!1    && a[k] && a[k]["Conditions Met?"]==!1) delete a[k];
      if(obj.show404NotFoundOnly==!0 && a[k] && a[k]["File Status"]!=404)    delete a[k];
      if(obj.show404NotFoundOnly==!1 && a[k] && a[k]["File Status"]==404)    delete a[k];
      m++;
    };
    if(obj.fromRow < 0 && obj.untilRow==undefined){
      obj.untilRow = m;
      obj.fromRow  = m + obj.fromRow;
    };
    l = m;
    m = 0;
    for(k in a){
      if(obj.fromRow!=undefined      && m < obj.fromRow)                     delete a[k];
      if(obj.untilRow!=undefined     && m > obj.untilRow)                    delete a[k];
      m++;
    };
    m = 0;
    for(k in a) m++;
    console.table(a);
    console.log(["Displaying", m, "of", l, "tags"].join(" "));
    window.DTM = a;
    if(obj.exportAsCSV!=undefined) exportAsCSV(a, obj.exportAsCSV);
  };
  function exportAsCSV(a, fileName){
    var b, c, d = [], e = {"File Name":""}, f, g;
    g = document.createElement("a");
    function escapeforCSV(item){
      return ["\"", (item + "").replace(/"/gi, "\"\""), "\""].join("");
    };
    for(b in a) for(c in a[b]) e[c] = "";
    for(c in e){
      d.push(c);
      d.push(",");
    };
    d.splice(-1, 1);
    d.push("\r\n");
    for(b in a){
      d.push(b);
      d.push(",");
      for(c in a[b]){
        d.push(escapeforCSV(a[b][c]));
        d.push(",");      
      };
      d.splice(-1, 1);
      d.push("\r\n");
    };
    f = new Blob([d.join("")], {type:"text/csv;charset=utf-8;"});
    g.href = URL.createObjectURL(f);
    g.download = fileName;
    g.style.visibility = "hidden";
    document.body.appendChild(g);
    g.click();
    document.body.removeChild(g);
  };
  function getFile(key, url, step, callback){
    var a = new XMLHttpRequest(), b, c;
    a.onreadystatechange = function(){
      if(a.readyState==4) callback(key, step, {
        status   : a.status,
        contents : a.responseText,
        loadTime : (new Date()) - c
      });
    };
    c = new Date();
    a.open("GET", url, true);
    a.send();
  };
  function getRuleType(type){
    return type=="pageLoadRules"   ? "Page Load Rule"   :
           type=="directCallRules" ? "Direct Call Rule" :
           type=="rules"           ? "Event Based Rule" : "Error";
  };
  function getScriptURL(file){
    var a = document.location.protocol;
    return [
      a, "/",
      _satellite.data.host[a.replace(":", "")],
      _satellite.settings.scriptDir.replace(/\/$/,""),
      file
    ].join("/").replace(/\/{3}/g, "//");
  };
  function hasRuleFired(ruleName){
    var a, b, c = !1;
    _satellite.Logger.getHistory().map(function(a){
      a.map(function(b){
        c = new RegExp("(?:Direct\\scall\\s)?Rule\\s\"(" + ruleName + ")\"\\sfired\.").test(b) ? !0 : c;
      });
    });
    return c;
  };
  function mapToColumns(raw){
    var a, b = {};
    if(!obj.columns) return raw;
    obj.columns.map(function(a){
      if(raw[a]) b[a] = raw[a];
    });
    return b;
  };
  function processRules(type){
    var b, c, d, e, f, g, h = 0, i, j;
    _satellite[type].map(function(b){
      c = hasRuleFired(b.name);
      d = b.trigger[0];
      e = d.arguments[0];
      f = {
        "Rule Name"         : b.name,
        "Type"              : getRuleType(type),
        "Conditions Met?"   : c,
        "Event"             : b.event,
        "Command"           : d.command
      };
      if(e.html!=undefined){
        d.arguments.map(function(g){
          f["Loading Type"] = undefined;
          f["Script URL"]   = undefined;
          j                 = mapToColumns(f);
          a[h]              = j;
          h++;
        });
      }else if(e.html==undefined && e.scripts!=undefined){
        e.scripts.map(function(g){
          f["Loading Type"] = e.sequential=!0 ? "sequential" : "non-sequential";
          f["Script URL"]   = getScriptURL(g.src);
          j                 = mapToColumns(f);
          a[g.src]          = j;
        });
      }else if(e.html==undefined && e.scripts==undefined){
          f["Loading Type"] = e.sequential=!0 ? "sequential" : "non-sequential";
          f["Script URL"]   = undefined;
          j                 = mapToColumns(f);
          a[h]              = j;
          h++;
      };
    });
    return a;
  };
  if(obj.showPageLoadRules)   processRules("pageLoadRules");
  if(obj.showEventBasedRules) processRules("rules");
  if(obj.showDirectCallRules) processRules("directCallRules");
  for(k in a) m++;
 for(k in a){
    m--;
    q = isNaN(k - 0) ? getScriptURL(k) : undefined;
    if(q) getFile(a[k], q, m, function(a, m, data){
      var b, c, d;
      b = {
        "File Status"       : data.status,
        "File Load Time"    : data.loadTime,
        "File Size"         : data.contents.length,
        "File Contents"     : data.contents.replace(/[\r\n]/gi,"")
      };
      c = mapToColumns(b);
      for(d in c) a[d] = c[d];
      if(m==0) cutTable();
    });
  };
})({
  columns             : ["File Contents"],
  showPageLoadRules   : true,
  showEventBasedRules : true,
  showDirectCallRules : true,
  exportAsCSV         : "test.csv"
});
