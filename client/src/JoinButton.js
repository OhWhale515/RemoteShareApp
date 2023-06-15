import { useContext } from "react";
import { RoomContext } from "./Room";

const React = require("react");

export const Join = () => {
    const { ws } = useContext(RoomContext);
    const joinRoom = () => {
        ws.emit("join-room");
    }
    return (
        React.createElement("button", { onClick: joinRoom, className: "bg-rose-400 py-2 px-8 rounded-lg text-xl hover:bg-rose-600 text-white" }, "Start A New Meeting")
    );
}
