let okRps = 0;
let err500Rps = 0;
let err404Rps = 0;

function send(url, count) {
  for (let i = 0; i < count; i++) {
    fetch(url).catch(() => {});
  }
}

function updateValue(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = `${value} req/s`;
  }
}

setInterval(() => {
  send("/api/ok", okRps);
  send("/api/error/404", err404Rps);
  send("/api/error/500", err500Rps);
}, 1000);

const okSlider = document.getElementById("ok");
const e404Slider = document.getElementById("e404");
const e500Slider = document.getElementById("e500");

okSlider.oninput = (e) => {
  okRps = Number(e.target.value);
  updateValue("ok-value", okRps);
};

e404Slider.oninput = (e) => {
  err404Rps = Number(e.target.value);
  updateValue("e404-value", err404Rps);
};

e500Slider.oninput = (e) => {
  err500Rps = Number(e.target.value);
  updateValue("e500-value", err500Rps);
};

const send200 = document.getElementById("send-200");
const send404 = document.getElementById("send-404");
const send500 = document.getElementById("send-500");

send200.onclick = () => send("/api/ok", 1);
send404.onclick = () => send("/api/error/404", 1);
send500.onclick = () => send("/api/error/500", 1);

document.getElementById("burst500").onclick = () => {
  let seconds = 10;
  const i = setInterval(() => {
    send("/api/error/500", 30);
    if (--seconds <= 0) clearInterval(i);
  }, 1000);
};

updateValue("ok-value", okRps);
updateValue("e404-value", err404Rps);
updateValue("e500-value", err500Rps);
