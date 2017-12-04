(function(){
  var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
  var A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U;

  function a(){
    var b = ["pageName", "ch", "products", "campaign", "t", "pe", "pev1", "pev2"], c;
    for(c=1; c<=100;  c++) b.push(["c",     c].join(""));
    for(c=1; c<=255;  c++) b.push(["v",     c].join(""));
    for(c=1; c<=5;    c++) b.push(["h",     c].join(""));
    for(c=1; c<=3;    c++) b.push(["l",     c].join(""));
    for(c=1; c<=1000; c++) b.push(["event", c].join(""));
    return b;
  };
  function d(e){
    if(/^prop\d{1,2}$/.test(e) && e.match(/\d+/gi)[0]-0<=75) return e.replace("prop",         "c");
    if(/^eVar\d{1,2}$/.test(e) && e.match(/\d+/gi)[0]-0<=75) return e.replace("eVar",         "v");
    if(/^hier[12345]$/.test(e))                              return e.replace("hier",         "h");
    if(/^list[123]$/.test(e))                                return e.replace("list",         "l");
    if(/^channel$/.test(e))                                  return e.replace("channel",      "ch");
    if(/^currencyCode$/.test(e))                             return e.replace("currencyCode", "cc");
    return e;
  };
  function f(g){
    var h = "";
    if(h=g.match(/^c(\d{1,2})$/)) return ["prop", h[1]].join("");
    if(h=g.match(/^v(\d{1,2})$/)) return ["eVar", h[1]].join("");
    if(h=g.match(/^h(\d)$/))      return ["hier", h[1]].join("");
    if(h=g.match(/^l(\d)$/))      return ["list", h[1]].join("");
    if(g=="ch")                   return  "channel";
    if(g=="pe")                   return  "interactionType";
    if(g=="pev2")                 return  "interactionDescription";
    return g;
  };
  function h(i){
    return i=="lnk_d" ? "download" :
           i=="lnk_e" ? "exit"     :
           i=="lnk_o" ? "other"    : i;
  };
  function j(k, l){
    var m = k.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/);
    return l=="friendly" ? Date.UTC(
      +m[3],   m[2]-1,     +m[1],
      +m[4],  +m[5],       +m[6]
    ) : [
      [m[1], (+m[2]+1+""), m[3]].join("/"),
      [m[4],   m[5],       m[6]].join(":"),
      "GMT"
    ].join(" ");
  };
  function o(p){
    var q, r, s, t, u, v, w, x, y;
    q = p.match(/(?:&c\.&)(.*)(?:&\.c&)/);
    r = q ? p.replace(q[0], "&") : p;
    s = p.match(/\/b\/ss\/([a-zA-Z0-9]*)\/([\d.]*)\/([a-zA-Z0-9-.]*)\/(s\d*)\?/);
    if(!s) return {src : p};
    t = {
      src         : p,
      rsid        : s[1],
      mobile      : s[2],
      version     : s[3],
      cacheBuster : s[4],
      length      : p.length,
      isTooLong   : p.length > 2083
    };
    u = u||{};
    u.fields = a();
    if(q){
      t.contextData = {};
      q[1].split("&").map(function(v){
        u.fields.push(v.split("=")[0]);
      });
    };
    u.fields.map(function(w){
      x = r.match(new RegExp(["\\/b\\/ss\\/.*&", d(w), "=([^&]*)"].join("")));
      if(q) y = q[1].match(new RegExp([w, "=([^&?]*)"].join("")));
      if(x) t[f(w)] = h(unescape(x[1]));
      if(y) t.contextData[w] = unescape(y[1]);
    });
    t.timestamp         = j(t.t);
    t.t                 = j(t.t, "friendly");
    t.isPageView        = !t.interactionType;
    t.isPageInteraction = !t.isPageView;
    return t;
  };

  if((z = function(){
    A = "";
    for(B in window) if(/^s_i_/.test(B)) A = o(window[B].src);
    return A;
  })()=="") return;

  C = {
    page : z()
  };
  D = document.body.querySelectorAll("*");
  if(D.length==0) return C;
  C.interactions = [];
  console.log("Please make duckfaces while you wait");
  s_c_il[0].un = "baruktestabc";
  s_c_il[0].tl = function(E, F, G, H, I){
    var J = this;
    if(J.contextData.testCaseKey) J.linkTrackVars = J.apl(J.linkTrackVars, "contextData.testCaseKey", ",", 1);
    J.lnk = E;
    J.linkType = F;
    J.linkName = G;
    if(I){
      J.bct = E;
      J.bcf = I;
    };
    J.t(H);
  };

  K = {};
  L = ["blur", "change", "click"];
  M = function(N){
    N.element.addEventListener(N.event, function(){
      event.preventDefault();
    });
    N.element.dispatchEvent(new MouseEvent(
      N.event, {
        bubbles    : !0,
        cancelable : !0
      }
    ));
  };

  O = 0;
  L.map(function(Q){
    for(P=0; P<D.length; P++){
      s_c_il[0].contextData["testCaseKey"] = O + "";
      M(K[O] = {
        element : D[P],
        event   : Q
      });
      O++;
    };
  });

  for(R in window) if(/^s_i_/.test(R)){
    S = window[R].src;
    if(T = S.match(/&c\.&.*testCaseKey=(\d+).*&\.c.*&/)){
      U = K[+T[1]];
      C.interactions.push({
        element : U.element,
        event   : U.event,
        request : o(S)
      });
    };
  };

  return C;
})();
