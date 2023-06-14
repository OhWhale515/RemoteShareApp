import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";

const Room = (props) => {
  const userVideo = useRef();
  const partnerVideo = useRef();
  const socketRef = useRef();
  const userStream = useRef();
  const [screenShareActive, setScreenShareActive] = useState(false);

  useEffect(() => {
    // Add your code to initialize the video chat
  }, []);

  function startScreenShare() {
    // Add code to start the screen sharing
    setScreenShareActive(true);
  }

  function stopScreenShare() {
    // Add code to stop the screen sharing
    setScreenShareActive(false);
  }

  return (
    <div>
      <video controls style={{ height: 500, width: 500 }} autoPlay ref={userVideo} />
      <video controls style={{ height: 500, width: 500 }} autoPlay ref={partnerVideo} />
      {screenShareActive ? (
        <button onClick={stopScreenShare}>Stop Screen Share</button>
      ) : (
        <button onClick={startScreenShare}>Start Screen Share</button>
      )}
    </div>
  );
};

export default Room;
