import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import SimplePeer from 'simple-peer';
import CreateRoom from './routes/CreateRoom';
import Room from './routes/Room';
import './App.css';


const App = () => {
  const videoRef = useRef(null);
  const socketRef = useRef();
  const otherUserRef = useRef();
  const userStreamRef = useRef();

  useEffect(() => {
    // Connect to the server using Socket.IO
    socketRef.current = socketIOClient('/');

    // Get the user media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        userStreamRef.current = stream;
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
      });

    return () => {
      // Clean up resources
      socketRef.current.disconnect();
      userStreamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  const createPeer = () => {
    const peer = new SimplePeer({ initiator: true, trickle: false, stream: userStreamRef.current });

    peer.on('signal', offer => {
      socketRef.current.emit('offer', { target: otherUserRef.current, offer });
    });

    peer.on('stream', stream => {
      videoRef.current.srcObject = stream;
    });

    peer.on('connect', () => {
      // Peer connection established
    });

    peer.on('data', data => {
      // Handle data received from the peer
    });

    peer.on('error', error => {
      console.error('Peer error:', error);
    });

    return peer;
  };

  const joinRoom = roomID => {
    socketRef.current.emit('join room', roomID);

    socketRef.current.on('other user', otherUser => {
      otherUserRef.current = otherUser;
    });

    socketRef.current.on('offer', offer => {
      const peer = createPeer();
      peer.signal(offer);
    });

    socketRef.current.on('answer', answer => {
      const peer = createPeer();
      peer.signal(answer);
    });

    socketRef.current.on('ice-candidate', candidate => {
      const peer = createPeer();
      peer.signal(candidate);
    });
  };

  const RoomWrapper = () => {
    const { roomID } = useParams();

    return <Room roomID={roomID} />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<CreateRoom joinRoom={joinRoom} />} />
          <Route path="/room/:roomID" element={<RoomWrapper />} />
        </Routes>
      </BrowserRouter>

      <video ref={videoRef} autoPlay playsInline muted></video>
    </div>
  );
};

export default App;
