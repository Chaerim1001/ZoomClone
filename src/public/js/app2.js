const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

const call = document.getElementById("call");

call.hidden = true;

let myStream; //stream: 비디오 + 오디오
let muted = false;
let cameraOff= false;
let roomName;
let myPeerConnection;


async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter( device => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        console.log(currentCamera);
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label === camera.label){
                option.selected = true;
            }
            camerasSelect.appendChild(option);
            console.log(camera);
        });
    }catch(e){
        console.log(e);
    }
};

async function getMedia(deviceId){
    const initialConstraints = {
            audio: true,
            video: {
                facingMode: "user"
            },
    }

    const cameraConstraints = {
        audio: true,
        video: {
            deviceId: {
                exact: deviceId
            },
        },
    }

    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstraints
        );
        myFace.srcObject = myStream;

        if(!deviceId){
            await getCameras();
        }
    } catch(e){
        console.log(e);
    }

};

function handleMuteClick(){
    myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));

    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    }
    else{
        muteBtn.innerText = "mute";
        muted = false;
    }
};

function handleCameraClick(){

    myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    
    if(cameraOff){
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    }
    else{
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
};

async function handelCameraChange(){
    await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick); 
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handelCameraChange);


// Welcome Form (방 선택)

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

async function handleWelcomSubmit(event){
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    await initCall();
    socket.emit("join_room", input.value);
    input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomSubmit);


//Socket Code

//Peer A에서만 실행되는 코드 (Peer B가 입장했을 경우)
socket.on("welcome", async () => {
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log("sent the offer");
    socket.emit("offer", offer, roomName);

});

//Peer B에서 실행되는 코드
socket.on("offer",async (offer) => {
    myPeerConnection.setRemoteDescription(offer); 
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
  });


socket.on("answer", (answer) => {
myPeerConnection.setRemoteDescription(answer);
});
// RTC code

function makeConnection(){
    myPeerConnection = new RTCPeerConnection();
    myStream.getTracks().forEach(
        (track) => myPeerConnection.addTrack(track, myStream));
};