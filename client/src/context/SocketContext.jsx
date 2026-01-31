import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (user) {
            // Create socket connection
            const newSocket = io("/", {
                transports: ['websocket', 'polling'], // Prioritize websocket
            });

            newSocket.on('connect', () => {
                console.log("Socket connected:", newSocket.id);
                // Join user room immediately on connect
                if (user._id || user.id) {
                    newSocket.emit('join', user._id || user.id);
                }
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        } else {
            // If no user, ensure socket is closed
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [user]); // Re-connect only when user changes (login/logout)

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
