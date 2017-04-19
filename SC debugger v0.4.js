(function(obj){
  var a = [], b = {}, c, d;
  switch(obj.constructor){
    case Object   : b = obj;             break;
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
    if(g=key.match(/c(\d{1,2})/)) return ["prop", g[1]].join("");
    if(g=key.match(/v(\d{1,2})/)) return ["eVar", g[1]].join("");
    if(g=key.match(/h(\d)/))      return ["hier", g[1]].join("");
    if(g=key.match(/l(\d)/))      return ["list", g[1]].join("");
    if(key=="ch")                 return "channel";
    if(key=="pe")                 return "interactionType";
    if(key=="pev2")               return "interactionDescription";
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
    var e, f, g, h, i, j = {};
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
    }else{
      b.fields.push("t");
      b.fields.map(function(i){
        j[i] = "";
      });
      b.fields = [];
      for(i in j) b.fields.push(i);
    };
    b.fields.map(function(g){
      h = str.match(new RegExp(["\\/b\\/ss\\/.*&", translateToRawKey(g), "=([^&]*)"].join("")));
      if(h) f[translateQueryStringKey(g)] = translateQueryStringValue(unescape(h[1]));
    });
    f.timestamp         = translateTimestamp(f.t);
    f.t                 = translateTimestamp(f.t, "friendly");
    f.isPageView        = !f.interactionType;
    f.isPageInteraction = !f.isPageView;
    return f;
  };

  if(b.request){
    return decodeRequest(b.request);
  }else{
    c = new RegExp(["^s_i.*", s_c_il[0].visitorNamespace].join(""), "gi");
    for(d in window) if(c.test(d)) a.push(decodeRequest(window[d].src));
    return a;
  };
})({
  fields  : ["pageName"],
  request : undefined
});
