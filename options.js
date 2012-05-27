// Default values
var d_showBubble = "N"; // No bubbles
var d_showChat = "Y";   // Display chat
var d_theme = "#ccf";   // Pale blue

// Helper function: select option from dropdown box
// Parameters: elementID, value to select, default value
function selectOption (eid, selval, defval) {
  if (selval == undefined) {
	  selval = defval;
  }
  var select = document.getElementById(eid);
  for (var i = 0; i < select.children.length; i++) {
	  var child = select.children[i];
	  if (child.value == selval) {
		  child.selected = "true";
		  break;
	  }
  }
}

// Loads saved options
function loadOptions() {
  var theme = localStorage["theme"];
  var showBubble = localStorage["showBubble"];
  var showChat = localStorage["showChat"];
  selectOption ("theme", theme, d_theme);
  selectOption ("showBubble", showBubble, d_showBubble);
  selectOption ("showChat", showChat, d_showChat);
}

// Save options
function saveOptions() {
  localStorage["showBubble"] = document.getElementById("showBubble");
  localStorage["showChat"] = document.getElementById("showChat");
  localStorage["theme"] = document.getElementById("theme");
}

// Reset plugin
function clearOptions() {
  localStorage.removeItem("theme");
  localStorage.removeItem("showBubble");
  localStorage.removeItem("showChat");
  location.reload();
}

