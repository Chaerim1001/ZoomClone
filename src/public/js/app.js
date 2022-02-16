//io: 자동적으로 백엔드 socket.io와 연결해주는 함수
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");


function backendDone(msg){
    console.log(`The backend says: `, msg);
};

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    
    //emit(이벤트이름, 보내고싶은 데이터, .... ,서버에서 실행할 함수)
    //서버에서 실행할 함수는 반드시 마지막 인자로 보내줘야 함
    socket.emit("enter_room", input.value, backendDone);
    input.value = "";
};  


form.addEventListener("submit", handleRoomSubmit);