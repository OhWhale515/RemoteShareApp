import React,{ useEffect } from 'react'
import './App.css';
import socketIO from 'socket.io-client'

const WS = 'http://localhost:5000'

function App() {
    useEffect(() => {
        socketIO(WS);
    }, []);
    return (
        <div className="App">
            <header className="App-header">
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
               
            </header>
        </div>
    );
}