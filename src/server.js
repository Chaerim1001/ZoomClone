import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on http://localhost:3000`);

//create http server 
const httpServer = http.createServer(app);

//create socketio server
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";

    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    
    socket.on("enter_room", (nickname, roomName, done) => { // done: front의 emit 함수의 세번째 인자
        socket["nickname"] = nickname;
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname); // 참여했다는걸 방안에 있는 (나를 제외한) 모두들에게 보냄
    });

    socket.on("new_message", (msg, roomName, done) => {
        socket.to(roomName).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });

    socket.on("nickname", (nickname) => {
        socket["nickname"] = nickname; 
    });

    socket.on("disconnecting", () => { //disconnecting: 접속을 중단할거긴 하지만 아직 방을 완전히 나가지는 않은 상태
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye", socket.nickname);
        });
    })
})


/* websocket 코드

//create webSocket server
const wss = new WebSocket.Server({ server });
const sockets = [];

// on method는 socket에 연결된 사람의 정보를 제공해준다.
// server.js에서 socket은 연결된 브라우저를 의미
wss.on("connection", (socket) => {
    sockets.push(socket);

    socket["nickname"] = "Anon"; //익명 사용자를 위함

    console.log("Connected to Browser ✔️");

    socket.on("close", () => console.log("Disconnected from the Browser ❌"));

    socket.on("message", (msg) => {
        //string 형태로 받은 message를 JSON 형식으로 바꿔줘야 type을 확인해서 처리가 가능해진다
        const message = JSON.parse(msg);

        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break
            case "nickname": 
                socket["nickname"] = message.payload;
                break
         }
    });
 }); 
 */

 httpServer.listen(3000, handleListen);