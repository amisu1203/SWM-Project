$(document).ready(function () {
  callQuotesApi();
});
function callQuotesApi() {
  fetch("https://api.adviceslip.com/advice")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let quote = data["slip"]["advice"];
      let temp_html = `
          <p>${quote}</p>
        `;
      $("#quote").html(temp_html);
    });
}

$(document).ready(function () {
  callImageApi();
});
function callImageApi() {
  fetch("https://random.imagecdn.app/v1/image?width=500&height=500&format=json")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let image = data["url"];
      let temp_html = `
          <p><img src="${image}" alt=""></p>
        `;
      $("#image").html(temp_html);
    });
}
