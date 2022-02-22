import http from "http";
import SocketIO from "socket.io"
import express from "express";
import { doesNotMatch } from "assert";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home2"));
app.get("/*", (req, res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on http://localhost:3000`);

//create http server 
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket.on("join_room", (roomName,done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
    })
})

 httpServer.listen(3000, handleListen);