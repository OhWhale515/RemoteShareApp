import { createContext } from "react";
const socketIOClient = require("socket.io-client");
const WS = "https://localhost:3000";

export const RoomContext = createContext(null);

const ws = socketIOClient(WS);

export const RoomProvider = ({ children }) => {
  return RoomContext.Provider({ value: { ws } }, children);
};
