const socket = io();

const myFace = document.getElementById("myFace");

let myStream; //stream: 비디오 + 오디오


async function getMedia(){
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            {
                audio: true,
                video: true,
            }
        );
        myFace.srcObject = myStream;
    } catch(e){
        console.log(e);
    }

};

getMedia();
