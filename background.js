//background.js

var state = "loading";
var currentTab = -1;
var currentWindow = -1;
var synth = window.speechSynthesis;
chrome.browserAction.setBadgeText({text: "..."});
chrome.browserAction.setTitle({title:"ReaderPro is initializing"});

synth.onvoiceschanged = function(){
  state = "idle";
  chrome.browserAction.setBadgeText({text: ""});
  chrome.browserAction.setTitle({title:"ReaderPro"});
  voices = synth.getVoices();
  console.log(voices.length + " voices loaded");
  
}

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
  }else if(state == "selecting"){
    chrome.tabs.sendMessage(tab.id, {"message": "state_idle"});
    idle(tab.id);
  }else if(state == "speaking"){
    idle(tab.id);
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
  synth.cancel();
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

//Set state to speaking
function speaking(id, utterance){
  state = "speaking";
  chrome.browserAction.setIcon(
    {
      path: "logo-red-32.png",
      tabId: id
    },
    function(){
      console.log("Icon changed to Red");
    }
  );
  utterance.onend = function(event){
    idle(id);
  }
}

//Messages received from tabs
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    if(sender.tab.id == currentTab && request.message == "state_idle"){
      idle(currentTab);
    }
    else if(sender.tab.id == currentTab && request.message == "synth"){
      console.log("Synth request received");
      if(request["text"] != undefined){
        var utterance = new SpeechSynthesisUtterance(request["text"]);
        utterance.voice= voices[0];
        synth.speak(utterance);
        speaking(currentTab, utterance);
      }
      var status = 1;
      sendResponse({status: status});
    }
  }
);


