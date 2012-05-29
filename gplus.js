// Helper function: Get settings from localStorage
function getLocalStorage (keyName) {
  var myValue;
  chrome.extension.sendRequest({method: "getLocalStorage", key: keyName}, function(response) {
    myValue = response.data;
  });
  return myValue;
}

/***** PART I: CSS INJECTIONS ******/

// Default values
var showbubble = getLocalStorage("showBubble");
var showchat = getLocalStorage("showChat");
var theme = getLocalStorage("theme");
var columns = getLocalStorage("columns");
if (showbubble === undefined) showbubble = "N";
if (showchat === undefined) showchat = "Y";
if (theme === undefined) theme = "#ccf";
if (columns === undefined) columns = "2";

// Generate Style overrides
var css = ".FE { background: -webkit-gradient(linear, left top, right top, from(" + theme + "), to(#ccc)) !important; } ";
if (columns == "2") {
  css = css + ".replacement {width: 50%; min-width: 500px; float: left; position: relative; } ";	
}
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


/***** PART II: JAVASCRIPT INJECTIONS ******/

// Add stream pausing functionality
// ================================

var pauseButton = document.createElement("div");
var pauseText = "| |";
var pauseTitle = "Click to pause stream.";
var startText = ">";
var startTitle = "Click to allow stream to update automatically.";
pauseButton.setAttribute("class", "pausebutton");
pauseButton.setAttribute("id", "paused");
pauseButton.setAttribute("onclick", "togglePause();");
pauseButton.setAttribute("title", pauseTitle);
pauseButton.innerHTML = pauseText;

var pauseScript = document.createElement("script");
pauseScript.innerHTML = " function togglePause() {  var pauseButton = document.getElementById(\"paused\");  if (pauseButton.innerHTML == \"" + pauseText + "\") { pauseButton.innerHTML = \"" + startText + "\"; pauseButton.setAttribute(\"title\", \"" + startTitle + "\");  } else { pauseButton.innerHTML = \"" + pauseText + "\"; pauseButton.setAttribute(\"title\", \"" + pauseTitle + "\");  }}";
head.appendChild(pauseScript);
// Split posts into two columns
// ============================

// Flood replacement divs with content
var timer;
var streamcontent;
var awdiv;
var mediadiv;
var textdiv;

function createReplacementDivs() {
  // Find stream content
  var divs = document.getElementsByTagName("div");
  for (var i = 0; i < divs.length; i++) {
    if (divs[i].getAttribute("guidedhelpid") == "streamcontent") {
     streamcontent =  divs[i];
   }
  }
  awdiv = streamcontent.childNodes[1];
  awdiv.setAttribute("style", "display: none;");

  // Create replacement divs
  mediadiv = document.createElement("div");
  textdiv = document.createElement("div");
  mediadiv.setAttribute("class", "replacement");
  mediadiv.setAttribute("id", "mediadiv");
  textdiv.setAttribute("class", "replacement");
  textdiv.setAttribute("id", "textdiv");
  streamcontent.insertBefore(mediadiv,streamcontent.childNodes[2]);
  streamcontent.insertBefore(textdiv,streamcontent.childNodes[2]);
  streamcontent.insertBefore(pauseButton,streamcontent.childNodes[2]);
  
  // Move get more post button
  streamcontent.childNodes[5].setAttribute("style", "position: fixed; bottom: 7px; right: 100px; z-index: 50; margin: 0px; ");
}

function sortContent() {

  // Check that replacement divs exist
  if (document.getElementById("mediadiv") === null || document.getElementById("textdiv") === null) {
    createReplacementDivs();
  }

  // Sort the content into replacement divs	
  if (paused.innerHTML == pauseText || (mediadiv.children.length == 0 && textdiv.children.length == 0)) {
    if (awdiv != "undefined")
    // Note: We always leave one element in the aw div so that G+ piles new posts in that div instead of sorting them incorrectly.
    for (var i = awdiv.children.length; i > 1; i--) {
      var child = awdiv.children[i-1];
      var timestamp = child.getElementsByTagName("a")[2];
      child.setAttribute('title', timestamp.getAttribute('title'));

      // Check for multimedia
      var isText = true;
      var divs = child.getElementsByTagName("div");
      for (var j = 0; j < divs.length; j++) {

        // Picture / Gallery
        if(divs[j].getAttribute('class') == "Vs Om Mi") {
          isText = false;
        }

        // Video
        if(divs[j].getAttribute('class') == "Uga" && divs[j].getAttribute('itemtype') == "http://schema.org/VideoObject") {
          isText = false;
        }
        
        // Angesagt
        if(divs[j].getAttribute('class') == "b01Gav") {
          isText = false;
        }
      }

      // Move div to correct block
      // TODO: initial load from new post queue is OK. subsequent post loads prepend from queue in correct order, but append from queue in wrong order.
      if (isText) {
        if (textdiv.children.length > 0) {
          if (child.getAttribute('title') > textdiv.children[0].getAttribute('title')) {
            textdiv.insertBefore (child, textdiv.children[0]);
          }
          else {
        	textdiv.appendChild (child);
          }
        } else {
          textdiv.appendChild (child);
        }
      }
      else {
        if (mediadiv.children.length > 0) {
          if (child.getAttribute('title') > mediadiv.children[0].getAttribute('title')) {
            mediadiv.insertBefore (child, mediadiv.children[0]);
          }
          else {
            mediadiv.appendChild (child);
          }
        } else {
          mediadiv.appendChild (child);
        }
      }
    }
  }

  timer = setTimeout( function () { sortContent(); }, 1000);
}
createReplacementDivs();
sortContent();
