//background.js

var state = "idle";
var currentTab = -1;
var currentWindow = -1;

//called when icon is clicked
chrome.browserAction.onClicked.addListener(function(tab) {
  if(state == "idle"){
    state = "selecting";
    currentTab = tab.id;
    chrome.windows.getCurrent(function(window){ currentWindow = window.id; });
    //change icon to yellow logo
    chrome.browserAction.setIcon(
      {
        path: "logo-yellow-32.png",
        tabId: tab.id
      },
      function(){
        console.log("Icon changed to Yellow");
      }
    );
    //send message to active tab
    chrome.tabs.sendMessage(tab.id, {"message": "state_selecting"});
  }
});

//If tab or window changes, stop select mode
chrome.tabs.onActivated.addListener(function(activeInfo){
  if(state != "idle"){
    idle(currentTab);
  }
});
chrome.windows.onFocusChanged.addListener(function(windowId){
  if(windowId != chrome.windows.WINDOW_ID_NONE && windowId != currentWindow && state != "idle"){
    idle(currentTab);
  }
});

//Set state to idle
function idle(id){
  state = "idle";
  chrome.browserAction.setIcon(
    {
      path: "logo-32.png",
      tabId: id
    },
    function(){
      console.log("Icon changed to Green");
    }
  );
}

//Messages received from tabs
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    if(sender.tab.id == currentTab && request.message == "state_idle"){
      idle(currentTab);
    }
  }
);
