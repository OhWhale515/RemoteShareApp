// CreateRoom.js
import React from "react";
import { v1 as uuid } from "uuid";

const CreateRoom = (props) => {
  function create() {
    const id = uuid();
    props.history.push(`/room/${id}`);
  }

  return (
    <div className="create-room-container">
      <button className="create-room-btn" onClick={create}>Create Room</button>
    </div>
  );
};

export default CreateRoom;
