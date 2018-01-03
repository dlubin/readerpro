//content.js

var state = "idle";

//New tab event - Request Audio from background
requestSynth = function(text){
  chrome.runtime.sendMessage({message: "synth", text: text}, function(response){
    if(response["status"] != 1){
      console.log("Something went wrong");
    }
  });
}

//Receive message from background
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message == "state_selecting"){
      selecting();      
    }else if(request.message == "state_idle"){
      state = "idle";
      $("p").unbind("mouseover",hoverListener);
      //Don't unbind mouseout to ensure that if something was already highlighted, 
      //it still gets unhighlighted on mouseout
  
      console.log("ReaderPro - Now in idle mode");
    }
  }
);

//On escape key press or right click -- stop selecting
$(document).keydown(
  function(eventObject){
    if(state == "selecting"){
      if(eventObject.which == 27){
        eventObject.preventDefault();
        idle();
      }
    }
  }
);
$(document).contextmenu(
  function(){
    if(state == "selecting"){
      idle();
      //Prevents normal right click functionality
      return false;
    }
  }
);

//When you click in selector mode, return to idle mode and, if text is highlighted,
//read it
$(document).click(
  function(e){
    if(state == "selecting"){
      var target = e.target;
      var text = $(target).text();
      requestSynth(text);
    }
  }
)

var hoverListener = function(){
  originalBackground = typeof $(this).css("background-color") != "undefined" ? $(this).css("background-color") : "";
  $(this).css("background-color","#87e3ff");
}
var hoverOffListener = function(){
  if(typeof originalBackground != "undefined" && originalBackground != null){
    $(this).css("background-color",originalBackground);
    originalBackground = null;
  }
}

//Set to "selecting" mode
function selecting() {
  state = "selecting";
  //Prevent repeated bindings
  $("p").unbind("mouseover",hoverListener);
  $("p").unbind("mouseout",hoverOffListener);
  //Update CSS so that text background becomes blue ("#87e3ff") on hover
  $("p").bind("mouseover",hoverListener);
  $("p").bind("mouseout",hoverOffListener);

  console.log("ReaderPro - Now in selecting mode");
}

//Set to "idle" mode
function idle(){
  chrome.runtime.sendMessage({"message":"state_idle"}, function(response){
    state = "idle";
    $("p").unbind("mouseover",hoverListener);
    //Don't unbind mouseout to ensure that if something was already highlighted, 
    //it still gets unhighlighted on mouseout

    console.log("ReaderPro - Now in idle mode");
  });
}
