import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPlayer, selectPlayerData, setHost, setMyAvatar, setMyId, setMyName } from "../../slices/playerSlice";
import { Title, Text, TextInput, Container, Avatar, Select, SimpleGrid, Divider, Button } from "@mantine/core";
import Peer from "peerjs";

const avatarOptions = [ //will replace these with pictures in the future, or allow users to upload own pictures
    { value: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png', label: 'Avatar 7' },
    { value: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png', label: 'Avatar 6' },
    { value: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png', label: 'Avatar 5' },
    { value: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png', label: 'Avatar 4' },
    { value: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png', label: 'Avatar 3' },
    { value: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png', label: 'Avatar 2' },
    { value: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png', label: 'Avatar 1' },
];

export function Player(props: any) {
    const { peerRef, connectionsRef } = props;
    const dispatch = useDispatch();
    const playerData = useSelector(selectPlayerData);

    const [showAvatarGrid, setShowAvatarGrid] = useState(false);

    useEffect(() => {
        if (window.location.search) {
            const urlParams = new URLSearchParams(window.location.search);
            dispatch(setHost(urlParams.get('hostId')));
        }
    }, []);

    function joinGame() {
        if (!peerRef.current){
            
            const peer = new Peer();
            peerRef.current = peer;
            peer.on('open', function(id) {
                dispatch(setMyId(id));
                const conn = peer.connect(playerData.hostId, { label: playerData.myName });
                connectionsRef.current = {Host : conn};
                
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
        } else {
            connectionsRef.current.Host.send(
                {
                    type: 'reconnect',
                    content: "I'm trying to reconnect!",
                    from: playerData.myName,
                    id: playerData.myId
                }
            )
        }
    }


    return (
        <>
            <Title order={1} ta="center">
                Welcome Player
                <Text>Explain how things work here</Text>
            </Title>
            <Divider my="xs" label="Player Info" labelPosition="center" />
            <Container style={{ maxWidth: '400px', margin: 'auto', padding: '16px' }}>
                <TextInput label="What's your name?" placeholder="Player Name" value={playerData.myName} onChange={(event) => dispatch(setMyName(event.target.value))}/>

                <Text>Choose your Avatar:</Text>
                {showAvatarGrid ? (
                    <SimpleGrid cols={3}>
                        {avatarOptions.map((option) => (
                            <Avatar
                                key={option.value}
                                src={option.value}  
                                radius="xl" size="xl"
                                onClick={() => {
                                    dispatch(setMyAvatar(option.value));
                                    setShowAvatarGrid(false);       
                                }}
                            />
                        ))}
                    </SimpleGrid>
                )
                : <Avatar radius="xl" size="xl" src={playerData.myAvatar} style={{margin: '0 auto' }} onClick={() => setShowAvatarGrid(!showAvatarGrid)}/>}
            </Container>
            {playerData.myName && (
                <>
                    <Divider my="xs" label="Join the game" labelPosition="center" />
                    <Button onClick={joinGame} style={{marginRight: "15px"}}>Join Game</Button>
                    <Button onClick={() => dispatch(resetPlayer())} color="red">Reset Player</Button>
                </>
            )}

            {playerData.myId && (
                <TextInput
                    label="Send a message to the host"
                    onBlur={(event) => {
                        console.log(connectionsRef.current.Host.peer)
                        if (connectionsRef.current.Host) {
                            connectionsRef.current.Host.send(event.target.value);
                        }
                    }}
                />
            )}
        </>
    )
}