
// Helper functions: Split posts into two columns
// ==============================================
// Hide original stream and replace it with two replacement divs
// Moves content from original stream into replacement divs
var timer;
var streamcontent;
var awdiv;
var mediadiv;
var textdiv;
var hide;
var rightcol;

function inArray (needle, haystack) {
  if (haystack.indexOf(needle) >= 0) { return true; }
  else { return false; }
}

function createReplacementDivs() {
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
  streamcontent.childNodes[5].setAttribute("style", "display: none;");
}

function sortContent() {

  // Find stream content
  var divs = document.getElementsByTagName("div");
  for (var i = 0; i < divs.length; i++) {
    if (divs[i].getAttribute("guidedhelpid") == "streamcontent") {
     streamcontent =  divs[i];
   }
  }

  // Check that it isn't a profile page
  if (streamcontent.parentNode.getAttribute("role") == "tabpanel") {
    return;
  }

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
      if (child) {
        var timestampCandidates = child.getElementsByTagName("a");
        var timestamp = timestampCandidates[2].getAttribute("title");
        for (var i = 0; i < timestampCandidates.length; i++) {
          if (timestampCandidates[i].getAttribute("title") == "Timestamp") {
            timestamp = timestampCandidates[i].innerHTML;
          }
        }
        child.setAttribute('title', timestamp);

        // Check if it should be moved to right col
        var isLeft = true;
        var divs = child.getElementsByTagName("div");
        for (var j = 0; j < divs.length; j++) {

          // Picture / Gallery
          if(inArray("photos", rightcol) && divs[j].getAttribute('class') == "dv Mm Zf") {
            isLeft = false;
          }
          if (inArray("photos", hide) && divs[j].getAttribute('class') == "dv Mm Zf") {
            child.setAttribute("style", "display: none;");
          }

          // Video
          if(inArray("videos", rightcol) && divs[j].getAttribute('class') == "bva" && divs[j].getAttribute('itemtype') == "http://schema.org/VideoObject") {
            isLeft = false;
          }
          if (inArray("videos", hide) && divs[j].getAttribute('class') == "bva" && divs[j].getAttribute('itemtype') == "http://schema.org/VideoObject") {
            child.setAttribute("style", "display: none;");
          }
        }
        
        // Angesagt
        if(inArray("whatshot", rightcol) && child.title == "null") {
          isLeft = false;
        }
        if (inArray("whatshot", hide) && child.title == "null") {
          child.setAttribute("style", "display: none;");
        }

        // Text (Other)
        if(inArray("text", rightcol) && isLeft == true) {
          isLeft = false;
        }

        // Move div to correct block
        // TODO: initial load from new post queue is OK. subsequent post loads prepend from queue in correct order, but append from queue in wrong order.
        if (isLeft) {
          if (textdiv.children.length > 0 && child.title != "null") {
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
          if (mediadiv.children.length > 0 && child.title != "null") {
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
  }

  timer = setTimeout( function () { sortContent(); }, 1000);
}

// Helper function: Get settings from localStorage
function go () {
  chrome.extension.sendRequest({method: "getLocalStorage"}, function(response) {
    
    /***** PART I: CSS INJECTIONS ******/

    // Default values
    var showbubble = response.data["showBubble"];
    var showchat = response.data["showChat"];
    var theme = response.data["theme"];
    var columns = response.data["columns"];
    hide = response.data["hide"];
    rightcol = response.data["rightcol"];
    if (showbubble === undefined) { showbubble = "N"; }
    if (showchat === undefined) { showchat = "Y"; }
    if (theme === undefined) { theme = "#ccf"; }
    if (columns === undefined) { columns = "2"; }
    if (hide === undefined) { hide = new Array("whatshot"); }
    if (rightcol === undefined) { rightcol = new Array("photos","videos","whatshot"); }


    // Generate Style overrides
    var css = ".MI { background: -webkit-gradient(linear, left top, right top, from(" + theme + "), to(#ccc)) !important; } ";
    if (columns == "2") {
      css = css + ".replacement {margin: 0 0 0 8px; min-width: 500px; float: left; position: relative; width: 49% } ";	
    }
    if (showbubble == "N") {
      css = css + ".ie { display: none !important; } .Zo { margin: 0 0 0 -50px; !important; } "; 
    }
    if (showchat == "N") {
      // TODO: CHECK
      css = css + ".n0b { display: none !important; } .K9 { margin: 0 0 0 100px !important; } .J9 {margin: 0 0 0 100px !important; }"; 
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


    /***** PART II: OPTION-CONTROLLED JAVASCRIPT INJECTIONS ******/

    if (columns == "2") {
      sortContent();
    }
  });
}

go();


/***** PART III: GLOBAL JAVASCRIPT INJECTIONS ******/

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

var head = document.getElementsByTagName("head")[0];
var pauseScript = document.createElement("script");
pauseScript.innerHTML = " function togglePause() {  var pauseButton = document.getElementById(\"paused\");  if (pauseButton.innerHTML == \"" + pauseText + "\") { pauseButton.innerHTML = \"" + startText + "\"; pauseButton.setAttribute(\"title\", \"" + startTitle + "\");  } else { pauseButton.innerHTML = \"" + pauseText + "\"; pauseButton.setAttribute(\"title\", \"" + pauseTitle + "\");  }}";
head.appendChild(pauseScript);