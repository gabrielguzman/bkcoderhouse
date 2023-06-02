const socket = io();
let user;
const messageInput = document.getElementById("msg");

Swal.fire({
  title: "Bienvenido",
  input: "text",
  text: "Identificate para participar del chat",
  icon: "success",
  inputValidator: (value) => {
    return !value && "Tenes que identificarte";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
});

socket.on("messages", (data) => {
  console.log("escucho");
  const html = data
    .map((elem, index) => {
      return `<div>
                <strong class="fs-4 text-primary">${elem.user}</strong>: <b class="fst-italic">${elem.message}</b>
            </div>`;
    })
    .join(" ");
  document.getElementById("messages").innerHTML = html;
  document.getElementById("messages").scrollTop =
    document.getElementById("messages").scrollHeight;
});

messageInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    let message = messageInput.value;
    if (message.trim().length > 0) {
      socket.emit("message", { user, message });
      messageInput.value = "";
    }
  }
});

socket.emit("welcome", "Nuevo cliente conectado en el chat");
