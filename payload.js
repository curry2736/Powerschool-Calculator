var total = 0;
var total2 = 0;
var cusid_ele = document.getElementsByClassName('bold-underline');
var complete;
var originallyNoComma;
var gradeType = []; 
var gradeTypeNoDupe = [];
var gradeNumeratorArray = [];
var gradeDenominatorArray = [];
var timesRun = 0;


window.addEventListener('load', function (evt) {
    chrome.tabs.executeScript(null, {file: "jquery-3.4.1.min.js"});
    chrome.tabs.executeScript(null, {file: "sweetalert.min.js"})
});


//grab grades from powerschool page
for (var i = 0; i < cusid_ele.length; ++i) {
    var item = cusid_ele[i].innerHTML.toString();
    var position = item.indexOf("/")
    var substringWithComma = item.substring(0,position);
    var substring2WithComma = item.substring(position+1);
    if (substringWithComma.includes(",")) {
        var position2 = substringWithComma.indexOf(",");
        var part1 = substringWithComma.substring(0, position2);
        var part2 = substringWithComma.substring(position2+1);
        complete = part1+part2;
        if (isNaN(parseInt(complete, 10)) == true) {
            gradeNumeratorArray.push(0);
        } else {
            complete = parseInt(complete, 10);
            total += complete;
            gradeNumeratorArray.push(complete);
        }


    } else {
        if (isNaN(parseInt(substringWithComma, 10)) == false) {
            originallyNoComma = parseInt(substringWithComma, 10);
            total += originallyNoComma;
            gradeNumeratorArray.push(originallyNoComma);
        } else {
            gradeNumeratorArray.push(0);
        }

    }

    if (substring2WithComma.includes(",")) {
        var position3 = substringWithComma.indexOf(",");
        var part3 = substring2WithComma.substring(0, position3);
        var part4 = substring2WithComma.substring(position3+1);
        complete2 = part3+part4;
        if (isNaN(parseInt(complete2, 10)) == false) {
            complete2 = parseInt(complete2, 10);
            total2 += complete2;
            gradeDenominatorArray.push(complete2);
        }  else {
            gradeDenominatorArray.push(0);
        }

    } else {
        if (isNaN(parseInt(substring2WithComma, 10)) == false) {
            originallyNoComma2 = parseInt(substring2WithComma, 10);
            total2 += originallyNoComma2;
            gradeDenominatorArray.push(originallyNoComma2);
        } else {
            gradeDenominatorArray.push(0);
        }
    }

 	var substringNoComma = complete;
    substringNoComma = parseInt(substringNoComma, 10);
}


//grab grade types
for (x in document.getElementsByClassName('bold-underline')) {
	if (timesRun == document.getElementsByClassName('bold-underline').length) {
		break;
	}
    if (document.getElementsByClassName('bold-underline')[x].parentElement.parentElement.cells[1].innerHTML.includes('href')) {
        gradeType.push(document.getElementsByClassName('bold-underline')[x].parentElement.parentElement.cells[1].childNodes[0].text);
        timesRun +=1;
    } else {
    	gradeType.push(document.getElementsByClassName('bold-underline')[x].parentElement.parentElement.cells[1].innerHTML);
    	timesRun +=1;
    }
}

//remove duplicates
for (i = 0; i < gradeType.length; i++ ){
	var timesSeen = 0;
	for (j = 0; j < gradeTypeNoDupe.length; j++) {
		if (gradeType[i] == gradeTypeNoDupe[j]) {
			timesSeen++;
		}
	}
	if (timesSeen == 0) {
		gradeTypeNoDupe.push(gradeType[i]);
	}
	
}



var categoryWeight = [];
var weightedPercent = [];
var grade = 0;
var g = 0;


var initialGradeTypeLength = gradeType.length;
var currentType = gradeType[0];
var totalNumerator = [];
var totalDenominator = [];
var keepIndex = 0;
var totalDenominator = [];
totalDenominator =  Array(gradeTypeNoDupe.length).fill(0);
totalNumerator =  Array(gradeTypeNoDupe.length).fill(0);

//calculate total numerator/denominators per grade type
for (var i = 0; i < initialGradeTypeLength; i++) {
    for (var j = 0; j < gradeTypeNoDupe.length; j++) {
        if (gradeType[i] == gradeTypeNoDupe[j]) {
            if (isNaN(gradeNumeratorArray[i] == true)) {
                continue;
            } else {
                totalNumerator[j] = totalNumerator[j] + gradeNumeratorArray[i];
                totalDenominator[j] = totalDenominator[j] + gradeDenominatorArray[i];
            }
        }
    }
}

chrome.runtime.sendMessage({content: total + "/" + total2, type: "m1"});
chrome.runtime.sendMessage({content: gradeTypeNoDupe, type: "m2", numerator: totalNumerator, denominator: totalDenominator});


