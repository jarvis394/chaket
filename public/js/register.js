$(document).ready(function() {

  function request(url, data) {
    const myRequest = new Request('https://chaket.glitch.me' + url, {
      method: 'POST',
      body: data
    });

    var x = fetch(myRequest)
      .then(response => {
        if (response.status === 200) {
          return response.text();
        } else if (response.status === 404) {
          return null;
        } else {
          return console.log("%cSomething went wrong on request", "color: #222; font-weight: 900; font-size: 12px; border: solid 1px #ff2222; border-radius: 5px; padding: 7px;")
        }
      })
      .then(response => {
        return response;
      });

    return x;
  }
  
});