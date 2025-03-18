const faceoutDiv = document.getElementById('socialProofingAsinFaceout_feature_div');

let boughtCount = null;
let boughtPeriod = null;

if (faceoutDiv) {
    const titleSpan = faceoutDiv.querySelector('#social-proofing-faceout-title-tk_bought .a-text-bold');
    const periodSpan = faceoutDiv.querySelector('#social-proofing-faceout-title-tk_bought span:not(.a-text-bold)');
    if (titleSpan) {
        boughtCount = titleSpan.textContent.trim().match(/^\d+(?:\.\d+)?K?\+?/)[0]; // Extract number, optional decimal, optional K, optional +
    }
    if(periodSpan){
      boughtPeriod = periodSpan.textContent.trim();
    }
}

console.log("Bought Count:", boughtCount);
console.log("Bought Period:", boughtPeriod);