(function(obj){
  var a = [], b = {}, c, d, e;
  switch(obj.constructor){
    case Object   : b =            obj;  break;
    case Array    : b = {fields  : obj}; break;
    case String   : b = {request : obj}; break;
  };
  function buildFullList(){
    var g = ["pageName", "ch", "products", "campaign", "t", "pe", "pev1", "pev2"], h;
    for(h=1; h<=100;  h++) g.push(["c",     h].join(""));
    for(h=1; h<=255;  h++) g.push(["v",     h].join(""));
    for(h=1; h<=5;    h++) g.push(["h",     h].join(""));
    for(h=1; h<=3;    h++) g.push(["l",     h].join(""));
    for(h=1; h<=1000; h++) g.push(["event", h].join(""));
    return g;
  };
  function translateToRawKey(key){
    if(/^prop\d{1,2}$/.test(key) && key.match(/\d+/gi)[0]-0<=75) return key.replace("prop",         "c");
    if(/^eVar\d{1,2}$/.test(key) && key.match(/\d+/gi)[0]-0<=75) return key.replace("eVar",         "v");
    if(/^hier[12345]$/.test(key))                                return key.replace("hier",         "h");
    if(/^list[123]$/.test(key))                                  return key.replace("list",         "l");
    if(/^channel$/.test(key))                                    return key.replace("channel",      "ch");
    if(/^currencyCode$/.test(key))                               return key.replace("currencyCode", "cc");
    return key;
  };
  function translateQueryStringKey(key){
    var g = "";
    if(g=key.match(/^c(\d{1,2})$/)) return ["prop", g[1]].join("");
    if(g=key.match(/^v(\d{1,2})$/)) return ["eVar", g[1]].join("");
    if(g=key.match(/^h(\d)$/))      return ["hier", g[1]].join("");
    if(g=key.match(/^l(\d)$/))      return ["list", g[1]].join("");
    if(key=="ch")                   return "channel";
    if(key=="pe")                   return "interactionType";
    if(key=="pev2")                 return "interactionDescription";
    return key;
  };
  function translateQueryStringValue(value){
    return value=="lnk_d" ? "download" :
           value=="lnk_e" ? "exit"     :
           value=="lnk_o" ? "other"    : value;
  };
  function translateTimestamp(t, mode){
    var g = t.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/);
    return mode=="friendly" ? Date.UTC(
      +g[3],   g[2]-1,     +g[1],
      +g[4],  +g[5],       +g[6]
    ) : [
      [g[1], (+g[2]+1+""), g[3]].join("/"),
      [g[4],   g[5],       g[6]].join(":"),
      "GMT"
    ].join(" ");
  };
  function decodeRequest(str){
    var e, f, g, h, i, j = {}, k, l, m;
    k = str.match(/(?:&c\.&)(.*)(?:&\.c&)/);
    if(k) str = str.replace(k[0], "&");
    e = str.match(/\/b\/ss\/([a-zA-Z0-9]*)\/([\d.]*)\/([a-zA-Z0-9-.]*)\/(s\d*)\?/);
    if(!e) return {src : str};
    f = {
      src         : str,
      rsid        : e[1],
      mobile      : e[2],
      version     : e[3],
      cacheBuster : e[4],
      length      : str.length,
      isTooLong   : str.length > 2083
    };
    if(b.fields==undefined || b.fields.constructor!==Array) return f;
    if(b.fields.length==0){
      b.fields = buildFullList();
      if(k) k[1].split("&").map(function(m){
        b.fields.push(m.split("=")[0]);
      });
    }else{
      b.fields.push("t");
      b.fields.map(function(i){
        j[i] = "";
      });
      b.fields = [];
      for(i in j) b.fields.push(i);
    };
    if(k){
      f.contextData     = {};
    };
    b.fields.map(function(g){
      h =  str.match(new RegExp(["\\/b\\/ss\\/.*&", translateToRawKey(g), "=([^&]*)"].join("")));
      if(k) l = k[1].match(new RegExp([g, "=([^&?]*)"].join("")));
      if(h) f[translateQueryStringKey(g)] = translateQueryStringValue(unescape(h[1]));
      if(l) f.contextData[g]              =                           unescape(l[1]);
    });
    f.timestamp         = translateTimestamp(f.t);
    f.t                 = translateTimestamp(f.t, "friendly");
    f.isPageView        = !f.interactionType;
    f.isPageInteraction = !f.isPageView;
    return f;
  };
  function compareObjects(actual, expected){
    var k, l, m = {
      ok         : {},
      wrong      : {},
      missing    : {},
      unexpected : {}
    };
    var n = actual.contextData, o = expected.contextData, p;
    for(k in actual) if(k!="contextData"){
      for(l in expected) if(l!="contextData"){
        if(k in expected && l in actual && k==l && expected[l]==actual[k]) m.ok[k]                     = expected[l];
        if(k in expected && l in actual && k==l && expected[l]!=actual[k]) m.wrong[k]                  = actual[k];
        if(!(l in actual))                                                 m.missing[l]                = expected[l];
        if(!(k in expected))                                               m.unexpected[k]             = actual[k];
      };
      if(JSON.stringify(expected)=="{}")                                   m.unexpected[k]             = actual[k];
    };
    if(n){
      m.ok.contextData         = {};
      m.wrong.contextData      = {};
      m.unexpected.contextData = {};
      m.missing.contextData    = {};
      if(o){
        for(k in n) for(l in o){
          if(k in o && l in n && k==l && o[l]==n[k])                       m.ok.contextData[k]         = o[l];
          if(k in o && l in n && k==l && o[l]!=n[k])                       m.wrong.contextData[k]      = n[l];
          if(!(l in n))                                                    m.missing.contextData[l]    = o[l];
          if(!(k in o))                                                    m.unexpected.contextData[k] = n[k];
        };
      }else{
                                                                           m.missing.contextData       = o;
      };
    }else if(o){
                                                                           m.unexpected.contextData    = o;
    };
    for(k in m) if(k[m]=="contextData"){
      for(l in k[m]) if(k[m][l]==undefined)    delete k[m][l];
    }else{
      if(k[m]==undefined)                      delete k[m];
      [
        "cacheBuster", "isPageInteraction", "isPageView", "isTooLong", "length", "source",
        "t",           "timestamp",         "version",    "pe",        "pev1",   "pev2"
      ].map(function(l){
        delete m.unexpected[l];
      });
    };    
    for(p in m) if(JSON.stringify(m[p])=="{}") delete m[p];
    return m;
  };
  if(b.request){
    e = decodeRequest(b.request);
    if(b.expect){
      return compareObjects(e, b.expect);
    }else{
      return e;
    };
  }else{
    c = new RegExp(["^s_i.*", s_c_il[0].visitorNamespace].join(""), "gi");
    for(d in window) if(c.test(d)) a.push(decodeRequest(window[d].src));
    return a;
  };
})({
  expect  : {
    pageName:"Personal:Homepage:P1242557947640",
    eVar2:"New",
    prop9:"test",
    contextData:{
      a:1,
      c:3
    }
  },
  fields  : [],
  request : ""
});
