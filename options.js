// Default values
var d_showBubble = "N"; // No bubbles
var d_showChat = "Y";   // Display chat
var d_theme = "#ccf";   // Pale blue
var d_columns = 2;	// Sort posts
var d_hide = new Array("whatshot"); // Hide whats hot
var d_rightcol = new Array("photos","videos","whatshot");

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

// Helper function: select options from multi-select box
// Parameters: elementID, values to select, default values
function selectOptions (eid, selval, defval) {
  if (selval == undefined) {
	  selval = defval;
  }
  var select = document.getElementById(eid);
  for (var i = 0; i < select.children.length; i++) {
	  var child = select.children[i];
	  if (selval.indexOf(child.value) >= 0) {
		  child.selected = "true";
		  break;
	  }
  }
}

// Helper function: creates an array with all selected values from a select box
// Parameters: elementID
function getSelectedValueArray(eid) {
  var selectedValues = new Array();
  var selectBox = document.getElementById(eid);
  var count = 0;
  for (var i = 0; i < selectBox.options.length; i++) {
    if (selectBox.options[i].selected) {
      selectedValues[count] = selectBox.options[i].value;
      count++;
    }
  }
  return selectedValues;
}

// Loads saved options
function loadOptions() {
  var theme = localStorage["theme"];
  var showBubble = localStorage["showBubble"];
  var showChat = localStorage["showChat"];
  var columns = localStorage["columns"];
  var hide = localStorage["hide"];
  var rightcol = localStorage["rightcol"];
  selectOption ("theme", theme, d_theme);
  selectOption ("showBubble", showBubble, d_showBubble);
  selectOption ("showChat", showChat, d_showChat);
  selectOption ("columns", columns, d_columns);
  //selectOptions ("hide", hide, d_hide);
  //selectOptions ("rightcol", rightcol, d_rightcol);
}

// Save options
function saveOptions() {
  localStorage["showBubble"] = document.getElementById("showBubble").options[document.getElementById("showBubble").selectedIndex].value;
  localStorage["showChat"] = document.getElementById("showChat").options[document.getElementById("showChat").selectedIndex].value;
  localStorage["theme"] = document.getElementById("theme").options[document.getElementById("theme").selectedIndex].value;
  localStorage["columns"] = document.getElementById("columns").options[document.getElementById("columns").selectedIndex].value;
  //localStorage["hide"] = getSelectedValueArray("hide");
  //localStorage["rightcol"] = getSelectedValueArray("rightcol");
}

// Reset plugin
function clearOptions() {
  localStorage.removeItem("theme");
  localStorage.removeItem("showBubble");
  localStorage.removeItem("showChat");
  localStorage.removeItem("columns");
  localStorage.removeItem("hide");
  localStorage.removeItem("rightcol");
  location.reload();
}

