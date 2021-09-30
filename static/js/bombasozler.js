const bomb = document.querySelector(".fa-bomb")
const text = document.querySelector(".text-center")
const Pablo = document.querySelector("#pablo")
const Asian = document.querySelector("#asian")
Pablo.style.display = "none";
Asian.style.display = "none";
var sozler = [
"01101110 01100001 00100000 01100010 01101111 01101110 01100010 01100001 00100000 01110011 11000011 10110110 01111010 01101100 01100101 01110010 00100000 01101110 01101111 01101011 01110100 01100001 00100000 01100011 01110101 01101101 00100000 01100100 01100101 01110010 01101001 01101101 00001010",
"近前看其詳上寫着 秦香蓮那三十二歲 那狀告當朝驸馬郎 他欺君王啊瞞皇上 那悔婚男兒招東床 近前看其詳上寫着 秦香蓮那三十二歲 那狀告當朝驸馬郎 他欺君王啊瞞皇上 那悔婚男兒招東床",
"valo oynayan gaydir lol oynayan beydir",
"Pablo",
"الله أكبر الله اكبر الله أكبر فوق كيد المعتدي الله للمظلوم خير مؤيد أنا باليقين وبالسلاح سأفتدي بلدي ونور الحق يسطع في يدي قولوا معي قولوا معي الله الله الله أكبر الله فوق المعتدي",
]
var clickCount = 0
bomb.addEventListener("click",bombColor);
function bombColor(e) {
    if (clickCount == 0){
        bomb.style.color = "white";
        clickCount += 1;
    }
    else if (clickCount == 1){
        bomb.style.color = "orange";
        clickCount += 1;
    }
    else if (clickCount == 2){
        bomb.style.color = "red";
        clickCount += 1;
    }
    else if (clickCount == 3){
        clickCount = 0
        text.innerHTML = sozler[Math.floor(Math.random()*sozler.length)];
    if (text.innerHTML ===  sozler[3]){
        Asian.style.display = "none";
        Pablo.style.display = "block";
    }
    else if (text.innerHTML === sozler[1]){
        Pablo.style.display = "none";
        Asian.style.display = "block";
    }
    else{
        Pablo.style.display = "none";
        Asian.style.display = "none";
    }
    }
}