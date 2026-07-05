/* ==========================================
   PROBLEM SOLVING TRACKER
   Version 2.0
========================================== */

const START_TIME = 300;

let timeLeft = START_TIME;

let timer = null;

let running = false;

let history = JSON.parse(localStorage.getItem("history")) || [];

/* -----------------------------
      DOM
------------------------------ */

const timerText = document.getElementById("timer");

const timerStatus = document.getElementById("timerStatus");

const startBtn = document.getElementById("startBtn");

const resetBtn = document.getElementById("resetBtn");

const progressCircle = document.getElementById("progressCircle");

const historyTable = document.getElementById("historyTable");

const popup = document.getElementById("popup");

const radius = 115;

const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = circumference;

progressCircle.style.strokeDashoffset = 0;

/* -----------------------------
      TIMER
------------------------------ */

function formatTime(sec){

    const m = Math.floor(sec/60);

    const s = sec%60;

    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

}

function updateRing(){

    const percent = timeLeft/START_TIME;

    progressCircle.style.strokeDashoffset =
        circumference * (1-percent);

}

function updateTimer(){

    timerText.innerHTML = formatTime(timeLeft);

    updateRing();

}

updateTimer();

/* -----------------------------
      START
------------------------------ */

startBtn.onclick = ()=>{

    if(running) return;

    running = true;

    timerStatus.innerHTML = "Đang tập trung...";

    timer = setInterval(()=>{

        timeLeft--;

        updateTimer();

        if(timeLeft<=0){

            clearInterval(timer);

            running=false;

            timerStatus.innerHTML="Hoàn thành 5 phút! 🎉";

            showPopup("🎉 Bạn đã hoàn thành 5 phút tự suy nghĩ!");

            launchConfetti();

        }

    },1000);

};

/* -----------------------------
      RESET
------------------------------ */

function resetTimer(){

    clearInterval(timer);

    running=false;

    timeLeft=START_TIME;

    updateTimer();

    timerStatus.innerHTML="Sẵn sàng";

}

resetBtn.onclick=resetTimer;

/* -----------------------------
      POPUP
------------------------------ */

function showPopup(text){

    popup.innerHTML=text;

    popup.classList.add("show");

    setTimeout(()=>{

        popup.classList.remove("show");

    },2500);

}

/* -----------------------------
      CONFETTI
------------------------------ */

function launchConfetti(){

    confetti({

        particleCount:180,

        spread:100,

        origin:{y:.6}

    });

}
/* ==========================================
   HISTORY + LOCAL STORAGE
========================================== */

const sourceCheck = document.getElementById("sourceCheck");
const solutionCheck = document.getElementById("solutionCheck");

const totalChallenge = document.getElementById("totalChallenge");
const successRate = document.getElementById("successRate");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const streak = document.getElementById("streak");
const studyTime = document.getElementById("studyTime");
const badge = document.getElementById("badge");

const successBtn = document.getElementById("successBtn");
const helpBtn = document.getElementById("helpBtn");

const exportBtn = document.getElementById("exportBtn");
const resetAll = document.getElementById("resetAll");

/* -----------------------------
      LOAD TOGGLE
------------------------------ */

sourceCheck.checked =
JSON.parse(localStorage.getItem("sourceCheck")) || false;

solutionCheck.checked =
JSON.parse(localStorage.getItem("solutionCheck")) || false;

sourceCheck.onchange = () => {

    localStorage.setItem(
        "sourceCheck",
        sourceCheck.checked
    );

};

solutionCheck.onchange = () => {

    localStorage.setItem(
        "solutionCheck",
        solutionCheck.checked
    );

};

/* -----------------------------
      HISTORY
------------------------------ */

function saveHistory(){

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

}

function renderHistory(){

    historyTable.innerHTML="";

    history.forEach(item=>{

        const row=document.createElement("tr");

        row.innerHTML=`

            <td>${item.time}</td>

            <td>${item.result}</td>

        `;

        historyTable.appendChild(row);

    });

}

function addHistory(result){

    history.unshift({

        time:new Date().toLocaleTimeString("vi-VN"),

        result

    });

    saveHistory();

    renderHistory();

    updateStatistics();

}

/* -----------------------------
      BUTTON
------------------------------ */

successBtn.onclick=()=>{

    if(!sourceCheck.checked){

        showPopup("📚 Hãy xác nhận đã tìm ít nhất 1 nguồn.");

        return;

    }

    if(!solutionCheck.checked){

        showPopup("✍️ Hãy xác nhận đã thử một cách giải.");

        return;

    }

    addHistory("🌟 Tự giải quyết");

    launchConfetti();

    showPopup("🎉 Chúc mừng! Bạn đã tự giải quyết.");

    sourceCheck.checked=false;
    solutionCheck.checked=false;

    localStorage.removeItem("sourceCheck");
    localStorage.removeItem("solutionCheck");

};

helpBtn.onclick=()=>{

    addHistory("💬 Cần hỗ trợ");

    showPopup("💪 Bạn đã cố gắng trước khi hỏi.");

};

/* -----------------------------
      STATISTICS
------------------------------ */

function updateStatistics(){

    const total = history.length;

    const success = history.filter(

        h=>h.result.includes("Tự")

    ).length;

    totalChallenge.innerHTML = total;

    const rate = total===0
        ?0
        :Math.round(success/total*100);

    successRate.innerHTML = rate+"%";

    progressPercent.innerHTML = rate+"%";

    progressFill.style.width = rate+"%";

    let currentStreak=0;

    for(const item of history){

        if(item.result.includes("Tự"))

            currentStreak++;

        else

            break;

    }

    streak.innerHTML=currentStreak;

    studyTime.innerHTML =
        success*5+" phút";

    updateBadge(success);

}

/* -----------------------------
      BADGE
------------------------------ */

function updateBadge(success){

    if(success>=50){

        badge.innerHTML="👑 Chuyên gia";

    }

    else if(success>=30){

        badge.innerHTML="🏆 Bậc thầy";

    }

    else if(success>=20){

        badge.innerHTML="🥇 Kiên trì";

    }

    else if(success>=10){

        badge.innerHTML="⭐ Người tự lập";

    }

    else if(success>=5){

        badge.innerHTML="🌿 Đang tiến bộ";

    }

    else{

        badge.innerHTML="🌱 Người mới bắt đầu";

    }

}

/* -----------------------------
      EXPORT CSV
------------------------------ */

exportBtn.onclick=()=>{

    let csv="Thời gian,Kết quả\n";

    history.forEach(item=>{

        csv+=`${item.time},${item.result}\n`;

    });

    const blob=new Blob(

        [csv],

        {type:"text/csv"}

    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="ProblemSolvingHistory.csv";

    a.click();

    URL.revokeObjectURL(url);

};

/* -----------------------------
      RESET ALL
------------------------------ */

resetAll.onclick=()=>{

    if(!confirm("Bạn có chắc muốn xóa toàn bộ dữ liệu?"))

        return;

    history=[];

    saveHistory();

    renderHistory();

    updateStatistics();

    resetTimer();

};

/* -----------------------------
      START
------------------------------ */

renderHistory();

updateStatistics();