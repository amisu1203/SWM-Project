$(document).ready(function () {
  show_todo();
});
function show_todo() {
  // 보여주기
  fetch("/todo")
    .then((res) => res.json())
    .then((data) => {
      let rows = data["result"];
      $("#todo-list").empty();
      rows.forEach((a) => {
        let todo = a["todo"];
        let id = a["_id"];
        let isfinish = a["is_finish"];

        let temp_html = `<div id=${id}>
                             <div class="todo-body clearfix">
                             <input class="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate"><p class="txt-todo">${todo}</p>
                             <div class="start">
                                  <i class="xi-check" onclick="completeTodo('${id}',${isfinish}, ${"0"})"></i>
                                  <i class="xi-border-color" onclick="open_put('${id}')"></i>
                                  <i class="xi-trash" onclick="deletebtn('${id}')"></i>
                             </div>
                                <div class="finish" style="display: none">
                                  <input type="text" class="form-control p-3 shadow p-3 mb-2 bg-body rounded border border-dark" value='${todo}'/>
                                  <i class="xi-check" onclick="updatebtn('${id}')"></i>&nbsp&nbsp
                                  <li class="xi-close" onclick="cancel_put('${id}')"></li>
                                </div>
                              </div>
                            </div>
                            `;

        $("#todo-list").append(temp_html);

        if (isfinish == "1") {
          makeCompleteList(id);
        }
      });
    });
}

function save_todo() {
  // 저장하기
  let todo = $("#todo").val();

  let formData = new FormData();
  formData.append("todo_give", todo);
  formData.append("is_finish", 0);

  fetch("/todo", { method: "POST", body: formData })
    .then((response) => response.json())
    .then((data) => {
      alert(data["msg"]);
      window.location.reload();
    });
}

function deletebtn(id) {
  // 삭제하기
  let formData = new FormData();
  formData.append("id", id);
  fetch("/todo", { method: "DELETE", body: formData })
    .then((res) => res.json())
    .then((data) => {
      alert(data["msg"]);
      window.location.reload();
    });
}
//업데이트
function updatebtn(id, finish, mode) {
  //id = todo의 id  finish 완료 여부, mode 기능 선택
  $(`#${id} .todo-body .start`).show();
  $(`#${id} .todo-body .finish`).hide();
  let formData = new FormData();

  if (mode == "1") {
    let new_todo = $(`#${id} .todo-body`).val();
    formData.append("id", id);
    formData.append("new_todo", new_todo);
    formData.append("is_finish", finish);
  } else {
    let new_todo = $(`#${id} .todo-body .finish input`).val();
    formData.append("id", id);
    formData.append("new_todo", new_todo);
    formData.append("is_finish", finish);
  }

  fetch("/todo", {
    method: "PUT",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data["msg"]);
      window.location.reload();
    });
}

function open_put(id) {
  $(`#${id} .todo-body .start`).hide();
  $(`#${id} .todo-body .finish`).show();
}

function cancel_put(id) {
  $(`#${id} .todo-body .start`).show();
  $(`#${id} .todo-body .finish`).hide();
}

function makeCompleteList(id) {
  const todoDiv = document.getElementById(id);
  const todoCheckbox = todoDiv.querySelector("input[type=checkbox]");
  const todoTitle = todoDiv.querySelector("h2");
  todoCheckbox.checked = !todoCheckbox.checked;
  todoTitle.classList.add("completed");
}

function completeTodo(id) {
  const todoDiv = document.getElementById(id);
  const todoCheckbox = todoDiv.querySelector("input[type=checkbox]");
  const todoTitle = todoDiv.querySelector("h2");

  todoCheckbox.checked = !todoCheckbox.checked;
  if (todoCheckbox.checked) {
    todoTitle.classList.add("completed");
    updatebtn(id, "1", "0"); // 기존에 있던 todo에서 test로 바꿔줌
  } else {
    todoTitle.classList.remove("completed");
    updatebtn(id, "0", "0"); // test로 바꿈과 동시에 완료 여부도 완료됨으로 바꿔줌
  }
}

// 날씨 api
function onGeoOk(position) {
  const API_KEY = "2834387742b25d5393a21e88fee8246a";
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`;
  // console.log(url);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const weather = document.querySelector("#weather span:first-child");
      const city = document.querySelector("#weather span:last-child");
      city.innerText = data.name;
      weather.innerText =
        data.weather[0].main === "Clear"
          ? "☀️"
          : data.weather[0].main === "Clouds"
          ? "☁️"
          : data.weather[0].main === "Rain"
          ? "🌧️"
          : data.weather[0].main === "Snow"
          ? "❄️"
          : data.weather[0].main === "Thunderstorm"
          ? "⚡️"
          : data.weather[0].main;
      //  ${data.main.temp}`;
    });
}

function onGeoError() {
  alert("날씨 정보를 가져오지 못했어요🤔");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
