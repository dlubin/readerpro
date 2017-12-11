//content.js

var state = "idle";

//Receive message from background
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message == "state_selecting"){
      selecting();      
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

$(document).click(
  function(){
    if(state == "selecting"){

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
