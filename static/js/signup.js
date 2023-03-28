$(document).ready(() => {
  $("#form-join").on("submit", (e) => {
    e.preventDefault();
    join();
  });
});

const join = () => {
  let formData = new FormData();
  const user_id = $("#id").val();
  const user_nickname = $("#nickname").val();
  const user_pw = $("#pw").val();

  formData.append("id", user_id);
  formData.append("nickname", user_nickname);
  formData.append("password", user_pw);
  fetch("/join", { method: "POST", body: formData })
    .then((res) => res.json())
    .then((data) => {
      if (data["message"] == "이미 존재하는 아이디입니다.") {
        $("#id").focus();
      }
      alert(data["message"]);
    });
  return false;
};
