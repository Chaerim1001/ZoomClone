import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on http://localhost:3000`);

//create http server 
const server = http.createServer(app);

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

server.listen(3000, handleListen);