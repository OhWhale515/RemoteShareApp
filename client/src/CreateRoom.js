import React, { useState, useEffect } from "react";
import { v1 as uuid } from "uuid";

const CreateRoom = (props) => {
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    setRoomId(uuid());
  }, []);

  function startVideoChat() {
    props.history.push(`/room/${roomId}`);
  }

  function stopVideoChat() {
    // Add code to handle stopping the video chat
  }

  return (
    <div>
      <h1>Create Room</h1>
      <p>Room ID: {roomId}</p>
      <button onClick={startVideoChat}>Start Video Chat</button>
      <button onClick={stopVideoChat}>Stop Video Chat</button>
    </div>
  );
};

export default CreateRoom;
