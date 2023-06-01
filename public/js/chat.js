const socket = io();
let user;
const messageInput = document.getElementById("msg")

Swal.fire({
    title:"Bienvenido",
    input: "text",
    text: "Identificate para participar del chat",
    icon: "success",
    inputValidator: (value)=>{
        return !value && 'Tenes que identificarte';
    },
    allowOutsideClick: false,
}).then((result)=>{
    user = result.value;
});


socket.on('messages', data=>{
    console.log("escucho");
    const html = data
		.map((elem, index) => {
			return `<div>
                <strong>${elem.user}</strong>:${elem.message}
            </div>`;
		})
		.join(' '); 
	document.getElementById('messages').innerHTML = html;
})

messageInput.addEventListener('keyup', event => {
    if (event.key === "Enter"){
        let message = messageInput.value;
        if (message.trim().length > 0) {
            socket.emit("message", {user, message});
            messageInput.value='';
        }
    }
});

socket.emit('welcome','Nuevo cliente conectado en el chat');

