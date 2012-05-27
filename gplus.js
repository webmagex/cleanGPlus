
function getLocalStorage (keyName) {
  var myValue = undefined;
  chrome.extension.sendRequest({method: "getLocalStorage", key: keyName}, function(response) {
    myValue = response.data;
  });
  return myValue;
}

// function injectCSS() {
  var showbubble = getLocalStorage("showBubble");
  var showchat = getLocalStorage("showChat");
  var theme = getLocalStorage("theme");
  if (showbubble == undefined) showbubble = "N";
  if (showchat == undefined) showchat = "Y";
  if (theme == undefined) theme = "#ccf";

  // Generate Style overrides
  var css = ".FE {background: -webkit-gradient(linear, left top, right top, from(" + theme + "), to(#ccc)) !important; } ";
  if (showbubble == "N") {
    css = css + ".SF { display: none !important; } .Zo { margin: 0 0 0 -50px; !important; } "; 
  }
  if (showchat == "N") {
    css = css + ".SSb { display: none !important; } .E9 { margin: 0 0 0 100px; }"; 
  }

  // Create elements
  var head = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  var rules = document.createTextNode(css);

  // Inject Style overrides
  style.type = "text/css";
  if (style.styleSheet) {
    style.styleSheet.cssText = rules.nodeValue;
  } else {
    style.appendChild (rules);
  }
  head.appendChild(style);
// }

// document.addEventListener('DOMContentLoaded', function () { injectCSS(); });
