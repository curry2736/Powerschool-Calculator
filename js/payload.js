var total = 0;
var total2 = 0;
var cusid_ele = document.getElementsByClassName('bold-underline');
var complete;
var originallyNoComma;

var test = [{}];
for (var i = 0; i < 3; i++) {
    test[i] = {};
    test[i].test1 = 'test' + i;
    test[i].test2 = 'test' + (i*2);
}

var gradeType = [{}]; 





var gradeTypeNoDupe = [];
var gradeNumeratorArray = [];
var gradeDenominatorArray = [];
var timesRun = 0;
var noGrades = [];
var gradeTitles = [];
var gradeDates = [];


/*if (document.title.indexOf("Class") != -1) {
    //Creating Elements
    var btn = document.createElement("P");
    btn.innerText = "testtaesdaskjdkasjdkajksdjk";
    //Appending to DOM 
    document.body.appendChild(btn);
}*/


window.addEventListener('load', function (evt) {
    chrome.tabs.executeScript(null, {file: "jquery-3.4.1.min.js"});
    //chrome.tabs.executeScript(null, {file: "sweetalert.min.js"});
    chrome.tabs.executeScript(null, {file: "sweetalert2.all.min.js"});
    //chrome.tabs.executeScript(null, {file: "Chart.js"})
});


//grab grades from powerschool page
for (var i = 0; i < cusid_ele.length; i++) {
    gradeTitles[i] = document.getElementsByTagName("tbody")[1].getElementsByTagName("tr")[i+1].getElementsByTagName("td")[2].innerHTML;
    gradeDates[i] = document.getElementsByTagName("tbody")[1].getElementsByTagName("tr")[i+1].getElementsByTagName("td")[0].innerHTML;
    var item = cusid_ele[i].innerHTML.toString();
    var position = item.indexOf("/")
    var substringWithComma = item.substring(0,position);
    var substring2WithComma = item.substring(position+1);
    if (!item.includes('/')) {
    	if (isNaN(parseInt(item))) {
    		gradeNumeratorArray.push(0);
    		gradeDenominatorArray.push(0);
    		continue;
    	}
        gradeNumeratorArray.push(parseInt(item, 10));
        gradeDenominatorArray.push(0);
        total+=parseInt(item,10);
        continue;
    }
    if (substring2WithComma.includes(",")) {
        var position3 = substringWithComma.indexOf(",");
        var part3 = substring2WithComma.substring(0, position3);
        var part4 = substring2WithComma.substring(position3+1);
        complete2 = part3+part4;
        if (substringWithComma == "--") {
            gradeDenominatorArray.push(0);     
        } else if (substring2WithComma == "--" && ((typeof (parseInt (substringWithComma, 10)) ) == 'number')) {
        	gradeDenominatorArray.push(0);
        }
        else {
            complete2 = parseInt(complete2, 10);
            total2 += complete2;
            gradeDenominatorArray.push(complete2);
        }

    } else {
        if (substringWithComma == "--") {
            gradeDenominatorArray.push(0); 
        } else if (substring2WithComma == "--" && ((typeof (parseInt (substringWithComma, 10)) ) == 'number')) {
        	gradeDenominatorArray.push(0);
        }
        else {
            originallyNoComma2 = parseInt(substring2WithComma, 10);
            total2 += originallyNoComma2;
            gradeDenominatorArray.push(originallyNoComma2);
        }
    }


    if (substringWithComma.includes(",")) {
        var position2 = substringWithComma.indexOf(",");
        var part1 = substringWithComma.substring(0, position2);
        var part2 = substringWithComma.substring(position2+1);
        complete = part1+part2;
        if (substringWithComma == "--") {
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



 	var substringNoComma = complete;
    substringNoComma = parseInt(substringNoComma, 10);
}


//grab grade types
for (var i = 0; i < document.getElementsByClassName('bold-underline').length; i++) {
    gradeType[i]= {};
	if (timesRun == document.getElementsByClassName('bold-underline').length) {
		break;
	}
    if (document.getElementsByClassName('bold-underline')[i].parentElement.parentElement.cells[1].innerHTML.includes('href')) {
        gradeType[i].category = document.getElementsByClassName('bold-underline')[i].parentElement.parentElement.cells[1].childNodes[0].text;
        timesRun +=1;
    } else {
        gradeType[i].category = document.getElementsByClassName('bold-underline')[i].parentElement.parentElement.cells[1].innerHTML;
    	timesRun +=1;
    }
}

//remove duplicates
for (i = 0; i < gradeType.length; i++ ){
	var timesSeen = 0;
	for (j = 0; j < gradeTypeNoDupe.length; j++) {
		if (gradeType[i].category == gradeTypeNoDupe[j]) {
			timesSeen++;
		}
	}
	if (timesSeen == 0) {
		gradeTypeNoDupe.push(gradeType[i].category);
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
        if (gradeType[i].category == gradeTypeNoDupe[j]) {
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
chrome.runtime.sendMessage({content: gradeTypeNoDupe, type: "m2", numerator: totalNumerator, denominator: totalDenominator, names: gradeTitles, types: gradeType}, function(response) {

	Swal.fire({
		html: "Scroll down for your grade makeup! The blue shows how much of your grade a certain category makes. The red shows how much you are missing in that cateogry.",
		timer: 3500,
		timerProgressBar: true
	});

	var graphWeight = [];
    var indivWeightResponse = JSON.parse(response.indivWeight)
    console.log(indivWeightResponse);
	for (var i = 0; i < response.weight.length; i++) {
		graphWeight.push((response.weight[i] * 100 / response.tot).toFixed(2));
		if (((indivWeightResponse[i].val * 100/response.tot) - graphWeight[i]).toFixed(2) <= 0) {
			indivWeightResponse[i].val = 0;
		} else {
		  indivWeightResponse[i].val = ((indivWeightResponse[i].val * 100/response.tot) - graphWeight[i]).toFixed(2);
		}
	}

    var forGraph = [];
    for (var i = 0; i < indivWeightResponse.length; i++) {
        console.log(indivWeightResponse[i].val);
        forGraph[i] = indivWeightResponse[i].val;
    }
    console.log("test");

	if (document.getElementById("myCanvas")) {
		document.getElementById("myCanvas").outerHTML = "";
        document.getElementById("myCanvas2").outerHTML = "";   
	}

	if (document.getElementById("btnHolder")) {
		document.getElementById("btnHolder").outerHTML = "";
	}


	var holder = document.createElement("DIV");
	holder.setAttribute("id", "btnHolder");
	document.getElementById("content-main").appendChild(holder);



	var btn = document.createElement("BUTTON");
    btn.innerHTML = "Confused about the graph?";
    holder.appendChild(btn);
    holder.style.cssText = "text-align: center";

	btn.addEventListener("click", function(){
		Swal.fire({
			html: "The blue shows how much of your grade is made up by a certain category relative to what is already in your grade. <br></br> For example, say there were three categories: HW, TST, and FINAL, with each making up 1/3 of your grade. Now say you haven't taken the final. This means that only HW and TEST are in the grade. Relative to your current grade, HW and TEST now make up 1/2 of the total. The blue on the graph show how much percent of your current grade is made up by a certain category. The red shows how much the points you've missed in that category would have raised you. <br></br> <Strong>IMPORTANT:</Strong> To improve your grade the fastest, increase your percentage in the category with the largest red bar."}
			);
	});
	var chart = document.createElement("CANVAS");
	chart.setAttribute("id", "myCanvas");
	document.getElementById("content-main").appendChild(chart);
	var ctx = chart.getContext("2d");

	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: gradeTypeNoDupe,
	        datasets: [{
	            label: 'Makeup of Current Grade',
	            data: graphWeight,
	            backgroundColor: 'rgba(54, 162, 235, 0.2)',
	            borderColor: 'rgba(54, 162, 235, 1)',
	            borderWidth: 1
	        },  {
	       		label: '% missing in category',
	            data: forGraph,
	            backgroundColor: 'rgba(203, 46, 46, 0.2)',
	            borderColor: 'rgba(54, 162, 235, 1)',
	            borderWidth: 1
	        	}
	        ]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	            	stacked: true, 
	                ticks: {
	                    beginAtZero: true
	                }
	            }],
	            xAxes: [
	            	{
	            		stacked: true
	            	}
	            ]
	        }
	    }
	});

   

    var chart2 = document.createElement("CANVAS");
    chart2.setAttribute("id", "myCanvas2");
    document.getElementById("content-main").appendChild(chart2);
    var ctx2 = chart2.getContext("2d")
    var gradeOverTimeNum = [0];
    var gradeOverTimeDen = [0];
    var gradeOverTime = [0];
    for (var i = 0; i < gradeNumeratorArray.length; i++) {
        console.log((gradeNumeratorArray[i]/gradeDenominatorArray[i]));
        if (i == 0) {
            gradeOverTime[i] = gradeNumeratorArray[i]/gradeDenominatorArray[i];
            gradeOverTimeNum[i] = gradeNumeratorArray[i];
            gradeOverTimeDen[i] = gradeDenominatorArray[i];
        } else {
            gradeOverTimeNum[i] = gradeOverTimeNum[i-1] + gradeNumeratorArray[i];
            gradeOverTimeDen[i] = gradeOverTimeDen[i-1] + gradeDenominatorArray[i];
            gradeOverTime[i] = gradeOverTimeNum[i]/gradeOverTimeDen[i];
        }


    }

    var myChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: gradeDates,
            datasets: [{
                label: 'Score',
                data: gradeOverTime,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Unweighted Grade Over Time'
            }
        }
    });
});


