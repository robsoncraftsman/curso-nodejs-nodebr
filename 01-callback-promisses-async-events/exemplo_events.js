const EventEmitter = require("events");
class OnClickEvent extends EventEmitter {}

const onClick = new OnClickEvent();
const nomeEvento = "usuario:click";

onClick.on(nomeEvento, function (click) {
  console.log("Um usuario clicou", click);
});

onClick.emit(nomeEvento, "na barra de rolagem");
onClick.emit(nomeEvento, "no título");

let count = 0;
setInterval(function () {
  onClick.emit(nomeEvento, "no ok " + ++count);
}, 1000);
