function login() {
  data = new FormData();
  username_give = $("#username").val();
  password_give = $("#password").val();
  data.append("username_give", username_give);
  data.append("password_give", password_give);
  fetch("/login", {
    method: "POST",
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // 쿠키에 토큰을 저장합니다.
      document.cookie = "token=" + data.token + "; path=/";
      // 저장후 실행될 로직...(홈페이지로 이동?)
      window.location.href = "/index";
    })
    .catch((error) => {
      console.error(error);
    });
}

$(document).ready(function () {
  // 브라우저에 html업로드 되면 토큰 가져오기
  // getCookie는 아래에 만들어져 있습니다.
  // 왜 토큰애 통상적으로 저장하는지는 다른 저장소 (ex localstorage) 와 비교해보시기 바랍니다.
  var token = getCookie("token");
  console.log(token);
  if (token) {
    // 토큰 같은 키는 보통 headers 로 보냅니다.
    fetch("/api/test_token", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => response.json())
      .then((data) => {
        // 성공시 보통 유저 정보를 가져옵니다.
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
        // 로그인 인증이 안되면 로그인 패이지로 이동?
      });
  } else {
    // 쿠키에 저장된 토큰이 없으므로 로그인 패이지로 이동?
  }

  // 이름으로 쿠키 값 찾는 함수
  function getCookie(name) {
    var cookieArr = document.cookie.split(";");
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");
      if (name == cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }

    // Return null if cookie not found
    return null;
  }
});
