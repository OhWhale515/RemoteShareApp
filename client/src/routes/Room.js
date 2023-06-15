import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";

const Room = (props) => {
  const userVideo = useRef();
  const partnerVideo = useRef();
  const socketRef = useRef();
  const userStream = useRef();
  const [screenShareActive, setScreenShareActive] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        userStream.current = stream;
        socketRef.current = io.connect("/"); // Provide the appropriate URL to connect to the server

        socketRef.current.emit("join room", props.roomID); // Replace "props.roomID" with the actual room ID

        socketRef.current.on("other user", () => {
          // The other user is connected, start the call
          socketRef.current.emit("user joined", props.roomID); // Replace "props.roomID" with the actual room ID
        });

        socketRef.current.on("user joined", () => {
          // The call has been accepted by the other user, start the communication
          socketRef.current.emit("start communication", props.roomID); // Replace "props.roomID" with the actual room ID
        });

        socketRef.current.on("offer", (offer) => {
          // Receive the offer from the other user and set the remote description
          socketRef.current.emit("answer", { type: "answer", sdp: offer });
        });

        socketRef.current.on("answer", (answer) => {
          // Receive the answer from the other user and set the remote description
          userPeer.current.setRemoteDescription(answer);
        });

        socketRef.current.on("ice-candidate", (candidate) => {
          // Receive ICE candidate from the other user and add it to the peer connection
          userPeer.current.addIceCandidate(candidate);
        });

        const userPeer = new RTCPeerConnection(); // Create a new RTCPeerConnection

        userStream.current.getTracks().forEach((track) => {
          // Add all tracks from the user's stream to the peer connection
          userPeer.current.addTrack(track, userStream.current);
        });

        userPeer.current.ontrack = (event) => {
          // Set the remote stream as the source for the partner's video element
          partnerVideo.current.srcObject = event.streams[0];
        };

        userPeer.current.onicecandidate = (event) => {
          // Send ICE candidate to the other user
          if (event.candidate) {
            socketRef.current.emit("ice-candidate", event.candidate);
          }
        };

        socketRef.current.on("start communication", () => {
          // Start the communication by creating and sending an offer to the other user
          userPeer.current.createOffer().then((offer) => {
            socketRef.current.emit("offer", offer.sdp);
            userPeer.current.setLocalDescription(offer);
          });
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }, []);

  function startScreenShare() {
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        userStream.current = stream;

        // Replace the code below with the appropriate logic for sending the screen share stream to the other user
        socketRef.current.emit("start screen share", props.roomID, stream); // Replace "props.roomID" with the actual room ID

        setScreenShareActive(true);
      })
      .catch((error) => {
        console.error("Error accessing screen share:", error);
      });
  }

  function stopScreenShare() {
    userStream.current.getTracks().forEach((track) => {
      track.stop();
    });

    userVideo.current.srcObject = userStream.current;

    // Replace the code below with the appropriate logic for stopping the screen share on the other user's side
    socketRef.current.emit("stop screen share", props.roomID); // Replace "props.roomID" with the actual room ID

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
