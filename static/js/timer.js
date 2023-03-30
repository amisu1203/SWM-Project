//timeSum 위치 바꾸면 큰일나요
let timeSum = 0;

//화면에 DB 반영
$(document).ready(function () {
  show_timer();
  show_attend();
  dailyAttend();
});
let temp_html;
function show_timer() {
  fetch("/timer")
    .then((res) => res.json())
    .then((data) => {
      let rows = data["result"];
      $("#todaystudy").empty();
      rows.forEach((a) => {
        let timer = a["timer"];
        let b = parseInt(timer);
        timeSum += b;
        function getTimerString(timeSum) {
          let hour = parseInt(timeSum / (60 * 60));
          let min = parseInt((timeSum - hour * 60 * 60) / 60);
          let sec = timeSum % 60;
          return String(hour).padStart(2, "0") + ":" + String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
        }
        return timeSum, (temp_html = `${getTimerString(timeSum)}`);
      });

      $("#todaystudy").append(temp_html);
    });
}

//출첵 반영
//출첵, 누적일차, 하루 평균 이상
function show_attend() {
  fetch("/attend")
    .then((res) => res.json())
    .then((data) => {
      let rows = data["result"];
      $("#attendcheck").empty();
      let swmday = [];
      rows.forEach((a) => {
        let attend = a["attend"];
        temp_html = `<div class="list-css">${attend}</div>`;
        swmday.push(attend);
        $("#attendcheck").append(temp_html);
      });
      $("#swmday").append(`ㅅㅇㅁ ${swmday.length}일차`);
      let avgtime = parseInt(timeSum / swmday.length);
      function timerStringSecond(a) {
        let hour = parseInt(a / (60 * 60));
        let min = parseInt((a - hour * 60 * 60) / 60);
        let sec = a % 60;

        return String(hour).padStart(2, "0") + "시간" + String(min).padStart(2, "0") + "분" + String(sec).padStart(2, "0") + "초";
      }
      $("#avgstudy").append(`하루 평균 공부시간 : ${timerStringSecond(avgtime)}`);
    });
}

//출첵버튼 하루에 한번만 가능하게
function dailyAttend() {
  fetch("/attend")
    .then((res) => res.json())
    .then((data) => {
      let rows = data["result"];
      let date = new Date();
      let attendDate = date.getFullYear() + "." + (Number(date.getMonth()) + 1) + "." + date.getDate();
      rows.forEach((a) => {
        let attend = a["attend"];
        if (attend === attendDate) {
          btnDisabled();
        } else {
          btnActive();
        }
      });
    });
}

//누적시간 전송
function save_timer() {
  let dayTimer = time;
  let formData = new FormData();

  formData.append("timer_give", dayTimer);

  fetch("/timer", { method: "POST", body: formData })
    .then((response) => response.json())
    .then((data) => {
      alert(data["msg"]);
      window.location.reload();
    });
}

//출첵
function attendance() {
  let date = new Date();
  let attendance = date.getFullYear() + "." + (Number(date.getMonth()) + 1) + "." + date.getDate();
  let formData = new FormData();

  formData.append("attend_give", attendance);

  fetch("/attend", { method: "POST", body: formData })
    .then((response) => response.json())
    .then((data) => {
      alert(data["msg"]);
      window.location.reload();
    });
}

//타이머 기본 세팅
let timerState;
let time = timeSum;
let timer = document.getElementById("stopwatch");

//타이머 출력
function timerScreen() {
  timer.innerText = timerString();
  time++;
}

//타이머 시작
function startTimer() {
  timerScreen();
  timerState = setTimeout(startTimer, 1000);
}

//타이머 중지
function stopTimer() {
  clearTimeout(timerState);
}

//타이머 초기화
function resetTimer() {
  stopTimer();
  timer.innerText = "00:00:00";
  time = 0;
}

//타이머 출력2
function timerString() {
  let hour = parseInt(time / (60 * 60));
  let min = parseInt((time - hour * 60 * 60) / 60);
  let sec = time % 60;

  return String(hour).padStart(2, "0") + "시간" + String(min).padStart(2, "0") + "분" + String(sec).padStart(2, "0") + "초";
}

//출첵버튼 활성화
function btnActive() {
  const target = document.getElementById("attendance");
  target.disabled = false;
}

//출첵버튼 비활성화
function btnDisabled() {
  const target = document.getElementById("attendance");
  target.disabled = true;
}

//체크인,체크아웃 시간
// function checkIn() {
//   let today = new Date();
//   alert(
//     `체크인 시간 : ${today.getHours()}시 ${today.getMinutes()}분 ${today.getSeconds()}초`
//   );
// }

// function checkOut() {
//   let today = new Date();
//   alert(
//     `체크아웃 시간 : ${today.getHours()}시 ${today.getMinutes()}분 ${today.getSeconds()}초`
//   );
// }
