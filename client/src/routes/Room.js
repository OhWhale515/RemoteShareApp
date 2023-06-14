import React, { useRef, useEffect, useCallback } from "react";
import io from "socket.io-client";

const Room = (props) => {
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();
  const senders = useRef([]);

  const callUser = useCallback((userID) => {
    peerRef.current = createPeer(userID);
    userStream.current.getTracks().forEach((track) => senders.current.push(peerRef.current.addTrack(track, userStream.current)));
  }, [createPeer]);

  const handleRecieveCall = useCallback((incoming) => {
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current.getTracks().forEach((track) => peerRef.current.addTrack(track, userStream.current));
      })
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then((answer) => {
        return peerRef.current.setLocalDescription(answer);
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit("answer", payload);
      });
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
      userVideo.current.srcObject = stream;
      userStream.current = stream;

      socketRef.current = io.connect("/");
      socketRef.current.emit("join room", props.match.params.roomID);

      socketRef.current.on("other user", (userID) => {
        callUser(userID);
        otherUser.current = userID;
      });

      socketRef.current.on("user joined", (userID) => {
        otherUser.current = userID;
      });

      socketRef.current.on("offer", handleRecieveCall);

      socketRef.current.on("answer", handleAnswer);

      socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
    });
  }, [callUser, handleRecieveCall, props.match.params.roomID]);

  function createPeer(userID) {
    // ...
  }

  function handleAnswer(message) {
    // ...
  }

  function handleICECandidateEvent(e) {
    // ...
  }

  function handleNewICECandidateMsg(incoming) {
    // ...
  }

  function handleTrackEvent(e) {
    // ...
  }

  function shareScreen() {
    // ...
  }

  return (
    <div>
      <video controls style={{ height: 500, width: 500 }} autoPlay ref={userVideo} />
      <video controls style={{ height: 500, width: 500 }} autoPlay ref={partnerVideo} />
      <button onClick={shareScreen}>Share screen</button>
    </div>
  );
};

export default Room;
