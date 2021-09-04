minInput = document.querySelector("#min-input");
secInput = document.querySelector("#sec-input");
repeatAmountInput = document.querySelector("#repeat-amount-input");

timerBtn = document.querySelector(".timer-container");
timerDisplay = document.querySelector(".timer-text");

resetBtn = document.querySelector(".reset-btn");

timerAudio = document.getElementById("timer-audio");
audioStopBtn = document.querySelector(".audio-stop-btn");

statusLogo = document.querySelector(".status-logo")

let originalMinutes = 0;
let minutes = 0;

let originalSeconds = 0;
let seconds = 0;

let repeatAmount = 1;

let isPaused = true;
let audioPlayed = false;

let randomAudio;

repeats = 0;


minInput.addEventListener("change", function() {
    originalMinutes = minInput.value;
    originalMinutes++;
    originalMinutes--;
    minutes = originalMinutes.toLocaleString(undefined, {minimumIntegerDigits: 2});
});

secInput.addEventListener("change", function() {
    originalSeconds = secInput.value;
    originalSeconds++;
    originalSeconds--;
    seconds = originalSeconds.toLocaleString(undefined, {minimumIntegerDigits: 2});
});

repeatAmountInput.addEventListener("change", function(){
    repeatAmount = repeatAmountInput.value;
})

timerBtn.addEventListener("click", timerIntervalFunction); 

function timerFunction() {
    timerDisplay.innerText = minutes.toLocaleString(undefined, {minimumIntegerDigits: 2}) + " : " + seconds.toLocaleString(undefined, {minimumIntegerDigits: 2});

    if(seconds <= 0 && minutes <= 0) {
        statusLogo.innerHTML = "";
    }

    if(isPaused == false) {
        
        if(seconds <= 0 && minutes != 0) {
            minutes--;
            seconds = 60;
        } 
        else if(seconds <= 0 && minutes <= 0) {
            timerBtn.removeEventListener("click", timerIntervalFunction);
            isPaused = true;

            repeats++;
            timerBtn.style.borderColor = "tomato";            
            
            if(audioPlayed == false) {
                randomAudio = "timer-sound-" + (Math.floor(Math.random() * 3) + 1) + ".mp3";
                timerAudio.setAttribute("src", randomAudio);
                timerAudio.play();     
                audioPlayed = true;
            }

            audioStopBtn.style.display = "inline-block";
            
            audioStopBtn.addEventListener("click", function() {

                audioStopBtn.style.display = "none";

                timerAudio.pause();
                timerAudio.currentTime = 0;

                if(repeats < repeatAmount) {                    
                    clearTimeout(restartTimeout);  
                    audioPlayed = false; 
                               
                    setTimeout(function(){  
                        timerBtn.addEventListener("click", timerIntervalFunction);                       
                        isPaused = false;
                        statusLogo.innerHTML = "<i class='fas fa-pause-circle'></i>";

                        timerBtn.style.borderColor = "rgb(255, 153, 0)";                       
                        
                        seconds = originalSeconds;
                        minutes = originalMinutes;

                        timerDisplay.innerText = minutes.toLocaleString(undefined, {minimumIntegerDigits: 2}) + " : " + seconds.toLocaleString(undefined, {minimumIntegerDigits: 2});
                    }, 150);                    
                }
                else {
                    clearInterval(timerInterval);
                    isPaused = true;
                }
            });

            if(repeats < repeatAmount) {
                restartTimeout = 
                    setTimeout(function() {
                        timerBtn.addEventListener("click", timerIntervalFunction);
                        timerBtn.style.borderColor = "rgb(255, 153, 0)";

                        timerAudio.pause();
                        timerAudio.currentTime = 0;

                        audioPlayed = false;

                        isPaused = false;
                        statusLogo.innerHTML = "<i class='fas fa-pause-circle'></i>";
                        
                        seconds = originalSeconds;
                        minutes = originalMinutes;

                        timerDisplay.innerText = minutes.toLocaleString(undefined, {minimumIntegerDigits: 2}) + " : " + seconds.toLocaleString(undefined, {minimumIntegerDigits: 2});
                    }, 26000);                
            } 
            else {
                clearInterval(timerInterval);
                isPaused = true;
            }          
        }  

        if(seconds != 0) {
            seconds--;
        }        
    }  
}


resetBtn.addEventListener("click", function() {
    timerBtn.addEventListener("click", timerIntervalFunction);
    timerDisplay.innerText = "Start Timer";

    seconds = originalSeconds;
    minutes = originalMinutes;

    timerBtn.style.borderColor = "rgb(255, 153, 0)";
    timerDisplay.style.color = "snow";
    audioStopBtn.style.display = "none";

    isPaused = true;
    statusLogo.innerHTML = "";
    
    audioPlayed = false;
    timerAudio.pause();
    timerAudio.currentTime = 0;

    clearInterval(timerInterval);     

    repeats = 0;  
});

function timerIntervalFunction() {
    if(originalMinutes <= 0 && originalSeconds <= 0 || originalMinutes >= 60 || originalSeconds >= 60 || ((originalSeconds % 2 != 0 && originalSeconds % 2 != 1) || (originalMinutes % 2 != 0 && originalMinutes % 2 != 1))) {
        timerDisplay.style.color = "lightgray";
        timerBtn.style.borderColor = "tomato";
        timerDisplay.style.fontSize = "1.6rem";

        if (repeatAmount <= 0) {
            timerDisplay.innerText = "Please enter a valid repeat amount and time.";
        }
        else {
            timerDisplay.innerText = "Please enter a valid time.";
        }
    } 
    else if (repeatAmount <= 0) {
        timerDisplay.style.color = "lightgray";
        timerBtn.style.borderColor = "tomato";
        timerDisplay.style.fontSize = "1.6rem";
        
        timerDisplay.innerText = "Please enter a valid repeat amount.";
    }
    else {
        timerDisplay.style.color = "snow";
        timerBtn.style.borderColor = "rgb(255, 153, 0)";
        timerDisplay.style.fontSize = "2rem";

        isReset = false;
        if(seconds >= 0 && minutes >= 0) {        
            isPaused = !isPaused;
            console.log(isPaused);
        }    

        if (isPaused == false) { 
            if(seconds < 0 && minutes < 0) {
                statusLogo.innerHTML = "";
            }   
            else {
                statusLogo.innerHTML = "<i class='fas fa-pause-circle'></i>";
            }                   
            timerFunction();
            timerInterval = setInterval(timerFunction, 1000);             
        }
        else {
            if(seconds < 0 && minutes < 0) {
                statusLogo.innerHTML = "";
            }
            else {
                statusLogo.innerHTML = "<i class='fas fa-play-circle'></i>";
            }

            clearInterval(timerInterval);
        }
    }            
}