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
        console.log("Found match between " + url + " and " + tempdata[1] +"! : " + tempdata[2]);
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

function GetRandomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function Randomise(parameter){
  var data = parameter.split("=");
  
  var strLen = data[1].length;
  
  var rndStr = GetRandomString(strLen);
  //console.log("Random string is now: " + rndStr);
  
  return data[0] + "=" + rndStr;

}

function clean() {
	
	writeURL("");
	
	var url = document.getElementById("url").value;
	
    var originalLength = url.length;
   	var parameters = getURLParameters(url);
    
    var rules = readRules(url);
    
    var cleaned = false;
    
    for (var i = 0; i < parameters.length; i++) {
      if (isTrackingParameter(rules, parameters[i])) {
        parameters[i] = Randomise(parameters[i]);
        console.log("Parameter data changed to: " + parameters[i]);
        //parameters.splice(i,1);
        //i--; //step index back since one entry was just deleted...
        cleaned = true;
      }
    }
	
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
	
    if (!cleaned) {
      window.alert("No tracking parameters found!");
      updateStatus("No tracking parameters found!");
    }
	writeURL(url);
	
	
}


function hasTracking(url) {
  console.log("is this used?");
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


function isTrackingParameter(rules, parameter) {

  //console.log("isTrackingparameter called with parameter: " + parameter + " and rules: " + rules);
  var ruleArray = rules.split(",");
  var param = parameter.split("=");
  
  for (var i = 0; i < ruleArray.length; i++) {
    var regex = new RegExp(ruleArray[i]);
    if (regex.test(param) == true ) {
      return true;
    }
  }
  
  return false;
}
