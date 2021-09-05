minInput = document.querySelector("#min-input");
secInput = document.querySelector("#sec-input");

repeatAmountInput = document.querySelector("#repeat-amount-input");
ringTimeInput = document.querySelector("#ring-time-input");

uploadInput = document.querySelector("#audio-upload-input")

timerBtn = document.querySelector(".timer-container");
timerDisplay = document.querySelector(".timer-text");

resetBtn = document.querySelector(".reset-btn");

timerAudio = document.getElementById("timer-audio");
audioStopBtn = document.querySelector(".audio-stop-btn");

statusLogo = document.querySelector(".status-logo");
repeatsLeft = document.querySelector(".repeats-left");

let originalMinutes = 0;
let minutes = 0;

let originalSeconds = 0;
let seconds = 0;

let repeatAmount = 1;

let isPaused = true;
let audioPlayed = false;

let randomAudio;
let uploadedAudio = null;
let uploadedAudioExt = null;

let ringTime = 25;

let loops = 1;
let loopCount = 0;

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
    repeatAmount = Math.floor(repeatAmountInput.value);
})

ringTimeInput.addEventListener("change", function(){
    ringTime = Math.floor(ringTimeInput.value);
})

uploadInput.addEventListener("change", function(event){
    uploadedAudio = this.files[0];;
    uploadedAudioExt = getFileExtension(getFileName(uploadInput));
});

timerBtn.addEventListener("click", timerIntervalFunction); 

function timerFunction() {
    timerDisplay.innerText = minutes.toLocaleString(undefined, {minimumIntegerDigits: 2}) + " : " + seconds.toLocaleString(undefined, {minimumIntegerDigits: 2});

    if(seconds <= 0 && minutes <= 0) {
        statusLogo.innerHTML = "";
    }
    else {
        if(repeats < repeatAmount) {
            repeatsLeft.innerText = "Repeats Left: " + (repeatAmount - repeats - 1);
        }
        else {
            repeatsLeft.innerText = "Repeats Left: " + 0;
        }
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
                if(uploadedAudio != null
) {
                    timerAudio.setAttribute("src", URL.createObjectURL(uploadedAudio));
                }
                else {
                    randomAudio = "timer-sound-" + (Math.floor(Math.random() * 3) + 1) + ".mp3";
                    timerAudio.setAttribute("src", randomAudio);
                }                

                timerAudio.play();

                audioInterval = 
                    setInterval(function(){
                        timerAudio.play();                      
                    }, timerAudio.duration);
                
                setTimeout(function() {
                    clearInterval(audioInterval);
                    timerAudio.pause();
                    timerAudio.currentTime = 0;
                }, ringTime * 1000);

                audioPlayed = true;
            }

            audioStopBtn.style.display = "inline-block";
            
            audioStopBtn.addEventListener("click", function() {
                if(repeats < repeatAmount) {
                    repeatsLeft.innerText = "Repeats Left: " + (repeatAmount - repeats - 1);
                }
                else {
                    repeatsLeft.innerText = "Repeats Left: " + 0;
                }
                

                audioStopBtn.style.display = "none";

                timerAudio.pause();
                timerAudio.currentTime = 0;

                clearInterval(audioInterval);

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
                        if(repeats < repeatAmount) {
                            repeatsLeft.innerText = "Repeats Left: " + (repeatAmount - repeats - 1);
                        }
                        else {
                            repeatsLeft.innerText = "Repeats Left: " + 0;
                        }
                        
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
                    }, ringTime * 1000);                
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

function timerIntervalFunction() {
    if(originalMinutes <= 0 && originalSeconds <= 0 || originalMinutes >= 60 || originalSeconds >= 60 || ((originalSeconds % 2 != 0 && originalSeconds % 2 != 1) || (originalMinutes % 2 != 0 && originalMinutes % 2 != 1)) || repeatAmount <= 0 || ringTime <= 0 || ringTime >= 60) {
        timerDisplay.style.color = "lightgray";
        timerBtn.style.borderColor = "tomato";
        timerDisplay.style.fontSize = "1.6rem";

        timerDisplay.innerText = "Invalid Input(s).";
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
            
            if(seconds == 59) {
                seconds = 0;
                minutes++;
            }   
            else {
                seconds++;
            }
            clearInterval(timerInterval);
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
    timerDisplay.style.fontSize = "2rem";
    audioStopBtn.style.display = "none";

    isPaused = true;
    statusLogo.innerHTML = "";
    
    audioPlayed = false;
    timerAudio.pause();
    timerAudio.currentTime = 0;

    clearInterval(timerInterval);     
    clearInterval(audioInterval);

    repeats = 0; 
    repeatsLeft.innerText = "";
});

function getFileExtension(filename){
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length);
}

function getFileName(file) {
    return file.value;
}
