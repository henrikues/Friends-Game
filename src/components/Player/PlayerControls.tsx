import React, { useState } from 'react';
import { Button, TextInput } from '@mantine/core';
import { joinGame } from '../../helpers/connectionTools';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlayerData } from '../../slices/playerSlice';

const PlayerControls = (props: any) => {
    const { peerRef, connectionsRef } = props;
    const [chat, setChat] = useState('');
    const dispatch = useDispatch();
    const playerData = useSelector(selectPlayerData);
    if (connectionsRef.current.Host == null) {
        joinGame(dispatch, peerRef, connectionsRef, playerData);
        return <div>Please connect to the host first.</div>;
    } else {
        return (
            <div>
                <h3>Player Controls</h3>
                <TextInput
                    label="Send a chat message"
                    onChange={(e: any) => setChat(e.target.value)}
                    value={chat}
                />
                <Button
                    onClick={() => connectionsRef.current.Host.send({ type: 'message', content: chat })}
                >
                    Send
                </Button>
                <Button
                    onClick={() => connectionsRef.current.Host.send({ type: 'move', content: 'Move Player' })}
                >
                    Move Player
                </Button>
            </div>
        );
    }
};

export default PlayerControls;
