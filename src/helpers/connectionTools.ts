import Peer from 'peerjs';
import { setMyId } from '../slices/playerSlice';
import type { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { addPlayer, setHostId, setJoinUrl } from '../slices/hostSlice';
//import {store} from '../store';


export function generateId(isHost = false) {
    return "FriendsGame" +
        "-" +
        (isHost ? "Host" : "Player") +
        "-" +
        Math.random().toString(36).substring(2, 10);
}

export function joinGame(dispatch: Dispatch<UnknownAction>, peerRef: { current: Peer; }, connectionsRef: { current: { Host: any; }; }, playerData: { hostId: string; myName: any; }) {
    if (!peerRef.current) {
        const peer = new Peer();
        peerRef.current = peer;
        peer.on('open', function (id) {
            dispatch(setMyId(id));
            const conn = peer.connect(playerData.hostId, { label: playerData.myName });
            connectionsRef.current = { Host: conn };

            conn.on('data', (data: any) => {
                if (data.type === 'message') {
                    alert(`Message from host: ${data.content}`);
                } else if (data.type === 'reconnect') {
                    alert(`Host is trying to reconnect: ${data.content}`);
                } else if (data.type === 'disconnect') {
                    alert(`Host has disconnected: ${data.content}`);
                    connectionsRef.current.Host.close();
                    connectionsRef.current.Host = null;
                }
            });
        });
    }
}

export function registerHost(
    hostData: any
    , peerRef: { current: Peer; }
    , connectionsRef: { current: { [key: string]: any; }; }
    , onOpen: (arg0: any) => void
    , onClose: (arg0: any) => void
    , onData: (arg0: any) => void
    , dispatch: Dispatch<UnknownAction>
    , privateServerData: { name: string; port: number; path: string; }
) {
        const serverType = hostData.hostInfo.serverType;
        let peer;

        if (serverType === 'Private Server') {
            const { name, port, path } = privateServerData;
            peer = new Peer("", {
                host: name,
                port: port,
                path: path,
            });
        } else {
            peer = new Peer();
        }
        peerRef.current = peer;

        //When we get a connection to the brokering server
        peer.on('open', function (id) {
            dispatch(setHostId(id));
            const url = new URL(window.location.href.replace("/host", "/player"));
            url.searchParams.set('hostId', id)
            dispatch(setJoinUrl(url.toString()));
        });

        //When we get a connection from another player
        peer.on('connection', (conn) => {
            dispatch(addPlayer({ peer: conn.peer, label: conn.label}));
            onOpen(conn.label);
            connectionsRef.current[conn.peer] = conn;
            conn.on('data', onData);
            conn.on('open', () => onOpen(conn.peer));
            conn.on('close', () => onClose(conn.peer));
        })
    }