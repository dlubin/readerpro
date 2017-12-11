//content.js

var state = "idle";

//Receive message from background
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message == "state_selecting"){
      state = "selecting";
      console.log("Now in selecting mode");      
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

//Return to idle mode
function idle(){
  chrome.runtime.sendMessage({"message":"state_idle"}, function(response){
    state = "idle";
    console.log("Now in idle mode");
  });
}
