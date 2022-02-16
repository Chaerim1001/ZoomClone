//io: 자동적으로 백엔드 socket.io와 연결해주는 함수
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

const room = document.getElementById("room");
room.hidden = true;

let roonName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    socket.emit("new_message", input.value, roonName, () => {
        addMessage(`You: ${input.value}`);
    });
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
    input.value = "";
};

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roonName}`

    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");

    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit); 
};

function handleRoomSubmit(event){
    event.preventDefault();
    const nickname = form.querySelector("#nickname");
    const roomname = form.querySelector("#roomname");

    const nicknameInput = nickname.querySelector("input");
    const roomInput = roomname.querySelector("input");
    
    //emit(이벤트이름, 보내고싶은 데이터, .... ,서버에서 실행할 함수)
    //서버에서 실행할 함수는 반드시 마지막 인자로 보내줘야 함
    socket.emit("enter_room", nicknameInput.value, roomInput.value, showRoom);
    roonName = roomInput.value;

    nicknameInput.value = "";
    roomInput.value = "";
};  

socket.on("welcome", (user)=>{
    addMessage(`${user} arrived!`);
})

socket.on("bye", (left)=>{
    addMessage(`${left} left  ㅜㅠ`);
})

socket.on("new_message", addMessage);

form.addEventListener("submit", handleRoomSubmit);