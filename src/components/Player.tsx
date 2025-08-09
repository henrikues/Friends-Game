import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPlayerData, setHost, setMyAvatar, setMyId, setMyName } from "../slices/playerSlice";
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

export function Player() {

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
        let playerId = "FriendsGame-Player-" + playerData.myName + "-" + Math.random().toString(36).substring(2, 10);
        const peer = new Peer();
        peer.on('open', function(id) {
            dispatch(setMyId(id));
            peer.connect(playerData.hostId, { label: playerData.myName });
        });
        
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
                    <Button onClick={joinGame}>Join Game</Button>
                </>
            )}
        </>
    )
}