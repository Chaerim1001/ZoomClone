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
    const input = room.querySelector("input");
    socket.emit("new_message", input.value, roonName, () => {
        addMessage(`You: ${input.value}`);
    });
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roonName}`

    const form = room.querySelector("form");
    form.addEventListener("submit", handleMessageSubmit);
};

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    
    //emit(이벤트이름, 보내고싶은 데이터, .... ,서버에서 실행할 함수)
    //서버에서 실행할 함수는 반드시 마지막 인자로 보내줘야 함
    socket.emit("enter_room", input.value, showRoom);
    roonName = input.value;
    input.value = "";
};  

socket.on("welcome", ()=>{
    addMessage("Someone joined!");
})

socket.on("bye", ()=>{
    addMessage("Someone left ㅜㅜ");
})

socket.on("new_message", addMessage);

form.addEventListener("submit", handleRoomSubmit);