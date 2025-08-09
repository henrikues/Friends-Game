import Peer from 'peerjs';
import {store} from '../store';


export function generateId(isHost = false) {
    return "FriendsGame" + 
            "-" +
            (isHost ? "Host" : "Player") +
            "-" +
            Math.random().toString(36).substring(2, 10);
}

