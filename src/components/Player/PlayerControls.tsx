import React, { useState } from 'react';
import { Button, TextInput } from '@mantine/core';

const PlayerControls = (props: any) => {
    const { peerRef, connectionsRef } = props;
    const [chat, setChat] = useState('');
    return (
        <div>
            <h3>Player Controls</h3>
            <TextInput
                label="Send a chat message"
                onChange={(e: any) => setChat(e.target.value)}
                value={chat}
            />
            <Button
                onClick={() => connectionsRef.current.Host.send({ type: 'message', content: 'Hello' })}
            >Send</Button>
            <Button
                onClick={() => connectionsRef.current.Host.send({ type: 'move', content: 'Move Player' })}
            >Move Player</Button>
        </div>
    );
};

export default PlayerControls;
