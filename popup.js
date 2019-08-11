// Inject the payload.js script into the current tab after the popout has loaded
window.addEventListener('load', function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'payload.js'
	});;



});
swal("Any grade entries without a grade will be automatically set to 0");

var cats = [];

function removeElement(className) {


    var element = document.getElementsByClassName(className);
    for (var z = 0; z < element.length; z++) {
      console.log(element[z]);
      element[z].outerHTML = "";
    }
}

//Listen to messages from the payload.js script and write to popout.html
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    var send = false;

    if(message.type == "m1") {
    	console.log("First message: ", message.content);
    	document.getElementById('rawScore').innerHTML = "Your raw score: " + message.content;
  	}

  	if(message.type == "m2") {
      
  		document.getElementById('categories').innerHTML = "";

  		  //showing scores for each grade category
    		for (var i = 0; i < message.content.length * 2; i++) {
          if (i < message.content.length/2 + 1) {
            cats[i] = message.content[i];
    	  	  var para = document.createElement("div");
            para.className = 'category';
    	  	  var node = document.createTextNode(message.content[i] + ": " + message.numerator[i] + "/" + message.denominator[i]);
    			  para.appendChild(node);
    			  var element = document.getElementById("mainDiv");
    			  element.appendChild(para);
            if (i == 2) {
              element.appendChild(document.createElement("br"));
            }

          //create form for putting grade weighting
          } else {
            var input = document.createElement("input"); 
            input.setAttribute('type',"number");
            input.setAttribute('name',"username");

            var para = document.createElement("div");
            para.id = 'weightDiv' + i;
            para.className = 'weightDiv';
            input.className = 'form-control';
            input.id = 'weighting' + i;
            var child = document.getElementById('weighting' + i);

            var node = document.createTextNode(message.content[i - message.content.length] + " weight: ");
            para.appendChild(node);
            para.appendChild(input);

            var element = document.getElementById("mainDiv");
            element.appendChild(para);

            var inputs = document.getElementsByClassName("form-control");
            for (var z = 0; z < inputs.length; z++) {
              console.log(inputs[z]);
              inputs[z].placeholder = "Enter category weight";
            }

         }
      }

      element.appendChild(document.createElement("br"));
      console.log(cats);
      var categoryWeight = [];
      var weightedPercent = [];
      var grade = 0;
      var g;
      var categoryWeight2 = [];
      
      //Cateogry weight button
      document.getElementById("catWeight").addEventListener("click", function(){
        var send = true;

        //get value from input form
        for (var i = 0; i < cats.length; i++) {
          var x = document.getElementsByClassName("form-control")[i].value;
          categoryWeight[i] = x;
          console.log(categoryWeight);
          weightedPercent[i] = (message.numerator[i]/message.denominator[i])*categoryWeight[i];
          grade += weightedPercent[i];
          g = grade.toFixed(2);
        }

        //display current final grade
        var para = document.createElement("div");
        para.className = 'category';
        var node = document.createTextNode("Your current final grade: " + g + "%");
        para.appendChild(node);
        var element = document.getElementById("mainDiv");
        element.appendChild(para);
        console.log(document.getElementsByClassName('weightDiv')[0].parentNode);
        for (var i = 0; i < cats.length; i++) {
          removeElement("weightDiv");
        }
        var brs = document.getElementsByTagName('br');
        brs[0].outerHTML = "";
      });

    //predict grade after taking final
    document.getElementById("finalGradePredict").addEventListener("click", function(){
        console.log(g);
        if (g == null) {
          swal("Please enter the category weighting first");
        } else {
          swal("How much of your total grade is the final worth?", {
            content: "input",
          })
          .then((value) => {
            var worth = value;
            if (!isNaN(worth)) {
              swal("What do you think you'd get on the final?", {
                content: "input",
              })
              .then((value2) => {
                var finalPredict = ((worth/100) * value2) + ((100-worth)/100 * g);
                console.log(finalPredict);
                swal("Your final grade will be " + finalPredict.toFixed(2) + "%");
              })
            } else {
              swal("Please enter only numbers");
            }
          });
        }
    });
  }
});


