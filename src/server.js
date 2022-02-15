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

function handleConnection(socket) {
    console.log(socket);
}

// on method는 socket에 연결된 사람의 정보를 제공해준다.
// socket은 서버와 브라우저 사이의 연결!
wss.on("connection", handleConnection);

server.listen(3000, handleListen);