let okRps = 0;
let err500Rps = 0;
let err404Rps = 0;

function send(url, count) {
  for (let i = 0; i < count; i++) {
    fetch(url).catch(() => {});
  }
}

setInterval(() => {
  send("/api/ok", okRps);
  send("/api/error/500", err500Rps);
  send("/api/error/404", err404Rps);
}, 1000);

document.getElementById("ok").oninput = (e) => {
  okRps = Number(e.target.value);
};

document.getElementById("e500").oninput = (e) => {
  err500Rps = Number(e.target.value);
};

document.getElementById("e404").oninput = (e) => {
  err404Rps = Number(e.target.value);
};

document.getElementById("burst500").onclick = () => {
  let seconds = 10;
  const i = setInterval(() => {
    send("/api/error/500", 30);
    if (--seconds <= 0) clearInterval(i);
  }, 1000);
};
