//io: 자동적으로 백엔드 socket.io와 연결해주는 함수
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

const room = document.getElementById("room");
room.hidden = true;

let roonName;

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roonName}`
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


form.addEventListener("submit", handleRoomSubmit);