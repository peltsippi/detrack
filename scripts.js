function autoclean() {
	clean();
	copy();
}

function paste(data) {
  document.getElementById("url").value = data;
  autoclean();
  //console.log(this);
  //let data = e.clipboardData.getData('text/plain');
  //console.log("paste called with " + data);
}

function load() {
	readJSON();
}

function buildBlockList(json) {
  var i = 1;
  var len = Object.keys(json.providers).length;
  for (var key in json.providers) {
    document.getElementById("filters").value += key + " - " + json.providers[key].urlPattern + " - " + json.providers[key].rules;
    if (i < len) { // add line changes except to last value
      document.getElementById("filters").value += "\n\n";
    }
    i++;
  }
  

  updateStatus("Blocklist updated from json file");
  
}

function readGlobalRules() {
  var data = document.getElementById("filters").value;
  var templist = data.split("\n\n");
  var output = [];
  templist.forEach( (entry) => {
    var tempdata = entry.split(" - ");
    //console.log(tempdata);
    if (tempdata[0] == "globalRules") {
      output = tempdata[2];
      //return tempdata[2];
    }
  });
  return output;
}

function readRules(url) {
  var data = document.getElementById("filters").value;
  var templist = data.split("\n\n");
  var output = [];
  templist.forEach( (entry, index) => {
    var tempdata = entry.split(" - ");
    //console.log("Searching for match to " + tempdata[0]);
    if (tempdata[0] != "globalRules" && tempdata[0] != undefined) {
      var regex = new RegExp(tempdata[1]);
      if (regex.test(url) == true) {
        //console.log("Found match between " + url + " and " + tempdata[1] +"! : " + tempdata[2]);
        //console.log("Index is " + index + " out of " + templist.length);
        output = tempdata[2];
      }
    }
  
  });
  if (output.length < 1) {
    output = readGlobalRules();
  }
  
  return output;
}

function readBlockList() {
  var blocklist = [];
  
  var data = document.getElementById("filters").value;
  
  var templist = data.split("\n\n");
  
  templist.forEach( (entry) => {
    var tempdata = entry.split(" - ");
    blocklist.push(tempdata);
  } 
  );  
  return blocklist;

}

function readJSON() {

  fetch("https://detrack.perunat.eu/data.min.json")
    .then(response => response.json())
    .then(json => buildBlockList(json))
    .catch(error => console.error(error));	
}

function clean() {
	
	writeURL("");
	
	var url = document.getElementById("url").value;
	
    var originalLength = url.length;
   	var parameters = getURLParameters(url);
    
    var rules = readRules(url);
    
    for (var i = 0; i < parameters.length; i++) {
      if (isTrackingParameter(rules, parameters[i])) {
        parameters.splice(i,1);
        i--; //step index back since one entry was just deleted...
      }
      //if (isTrackingParameter(parameters[i], isTrackingUrl(url))) {
      //  console.log("now we should delete the parameter");
      //}
    }
		
	//	window.alert("Remaining parameters: " + parameters);
	
	if (parameters.length > 0) {
		var cutPoint = url.indexOf("?");
		url = url.substring(0, cutPoint+1);
		
		for (var i = 0; i < parameters.length; i++) {
			url = url + parameters[i];
			if (i < parameters.length - 1) {
				url = url + "&";
			}
			
		}
		
	}
	
	else {
		var cutPoint = url.indexOf("?");
		if (cutPoint > 0) {
			url = url.substring(0,cutPoint);
		}
		
	}
	
    if (url.length == originalLength) {
      window.alert("No tracking parameters found!");
    }
	writeURL(url);
	
	
}

function isTrackingUrl(url) {
  var blocklist = readBlockList();
  var isTracking = false;
  blocklist.forEach((entry) =>  {
    if (entry[0] != "globalRules") {
      var regex = new RegExp(entry[1]);
      if (regex.test(url) == true) {
        isTracking = true;
      }
    }
  });
  return isTracking;
}

function isTrackingParameter(rules, parameter) {

  //console.log("isTrackingparameter called with parameter: " + parameter + " and rules: " + rules);
  var ruleArray = rules.split(",");
  //console.log("rule array: ");
  //console.log(ruleArray);
  
  var param = parameter.split("=");
  
  for (var i = 0; i < ruleArray.length; i++) {
    var regex = new RegExp(ruleArray[i]);
    if (regex.test(param) == true ) {
      return true;
    }
  }
  
  return false;
  
  /*
  	var data = parameter.split("=");
	
	var filters = getFilters();
	
	for (var i = 0; i < filters.length; i++) {
		var regex = new RegExp(filters[i]);
		//window.alert("Regex test result from data: " + data[0] + " with regex " + regex + " and end result: " + regex.test(data[0]));
		
		if (regex.test(data[0]) == true ) {
			return true;
			
		}
		
		
	}
  
  
  */

/*
    if (isTrackingUrl(url)) {
      console.log("Tracking url found");
      var rules = readSpecificRules(url).split(",");
      //if (isTrackingParameter(url, parameter)
    }
    else {
      console.log("Url not in tracking database");
      var globalList = readGlobalRules().split(",");
      console.log(globalList);
    }
 */

  //isTrackingParameter(url, parameter)
    return true;
}

function isTracking(parameter) {
	var data = parameter.split("=");
	
	var filters = getFilters();
	
	for (var i = 0; i < filters.length; i++) {
		var regex = new RegExp(filters[i]);
		//window.alert("Regex test result from data: " + data[0] + " with regex " + regex + " and end result: " + regex.test(data[0]));
		
		if (regex.test(data[0]) == true ) {
			return true;
			
		}
		
		
	}
	
	return false;

}



function getFilters() {
	var filterRAW = document.getElementById("filters").value;
	var filters = filterRAW.split("\n");
	
	return filters;
	
}

function cutTracking(url) {
	
	var tracking = hasTracking(url);
	//window.alert("Tracking id found: " + tracking);
	if (tracking.length > 0) {
		var trackingStart = url.indexOf(tracking);
		
		if (url[trackingStart - 1] == "&") {
			trackingStart--;
			//window.alert("Deleting extra & away");
		}
		
		var offset = trackingStart + tracking.length;
		var trackingEnd = url.indexOf("&", offset);
		
		var remaining = url.substring(0, trackingStart);
		
		if (trackingEnd > 0) {
			remaining += url.substring(trackingEnd, url.length);
		}
		
		return remaining;
	}
	
	return url;
	
}

function hasTracking(url) {
	var filterRAW = document.getElementById("filters").value;
	var filters = filterRAW.split("\n");
	
	for (let i = 0; i < filters.length; i++) {
		//window.alert("What is this");
		let position = url.indexOf(filters[i]);
		
		if (position > 0 ) {
			return filters[i];
			
		}
		
	}
	
	return "";
	
	
}

function copy() {
	
	textString = document.getElementById("cleaned");
	
	textString.select();
	
	textString.setSelectionRange(0,99999);
	
	navigator.clipboard.writeText(textString.value);
	
	updateStatus("Copied to clipboard!");
	
}

function writeURL(url) {
	document.getElementById("cleaned").value=url;
	
}

function updateStatus(string) {
	document.getElementById("status").value = string;
}

function getURLParameters(url) {
	
	var paramStart = url.indexOf("?");
	
	if (paramStart < 0) {
		return -1;
	}
	
	var parameters = url.substring(paramStart+1, url.length).split("&");
	//window.alert("Parameters: " + parameters);
	
	return parameters;
	
}
