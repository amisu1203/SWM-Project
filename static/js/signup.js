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
  const user_pw = $("#pw2").val();

  formData.append("id", user_id);
  formData.append("nickname", user_nickname);
  formData.append("password", user_pw);
  fetch("/join", { method: "POST", body: formData })
    .then((res) => res.json())
    .then((data) => {
      if (data["message"] == "이미 존재하는 아이디입니다.") {
        $("#id").focus();
        alert(data["message"]);
      } else if (data["message"] == "가입 완료") {
        alert(data["message"]);
        window.location.href = "/login";
      }
    });
};

const check_pw = () => {
  const user_pw1 = $("#pw1").val();
  const user_pw2 = $("#pw2").val();
  if (user_pw1 == user_pw2) {
    $("#text-pw-check").html("<div class='txt-pw-correct'>비밀번호가 일치합니다.</div>");
    $(".btn-join").attr("disabled", false);
  } else {
    $("#text-pw-check").html("<div class='txt-pw-incorrect'>비밀번호가 일치하지 않습니다.</div>");
  }
};
