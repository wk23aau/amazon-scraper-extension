// popup.js
document.getElementById('start').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "start" });
});

document.getElementById('pause').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "pause" });
});

document.getElementById('resume').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "resume" });
});
document.getElementById('stop').addEventListener('click',()=>{
   chrome.runtime.sendMessage({action:"stop"});
});
document.getElementById('discard').addEventListener('click', () => {
	chrome.runtime.sendMessage({ action: "discard" });
});


function updateButtonStates(processing,paused, stopped)
{
   //to handle enabling disabling from cross events trigger.
   document.getElementById('start').disabled = processing || paused;
   document.getElementById('pause').disabled = !processing || paused || stopped;
   document.getElementById('resume').disabled = !(paused || stopped) || processing ; //enabled only when pause
   document.getElementById('stop').disabled = !processing && !paused || stopped;
   document.getElementById('discard').disabled = processing;

}
//to handle user left by loading this popup
chrome.runtime.sendMessage({action:"checkState"},response=>{
	if(response) {
		const { processing, paused,stopped} = response;
        updateButtonStates(processing,paused, stopped);
    }
});