import { Title, Text, SegmentedControl, Divider, Container, Button, TextInput, Stack } from "@mantine/core";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { addPlayer, resetHost, selectHostData, selectPrivateServerData, setHostId, setJoinUrl, setPrivateServer, setServerType } from "../slices/hostSlice";
import Peer from "peerjs";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export function Host() {
    const dispatch = useDispatch();
    const hostData = useSelector(selectHostData);
    const privateServerData = useSelector(selectPrivateServerData);

    useEffect(() => {
        if (hostData.hostInfo.hostId) {
            //registerHost();
        }
    }, []);

    function registerHost () {
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
        peer.on('open', function(id) {
            dispatch(setHostId(id));
            const url = new URL(window.location.href.replace("/host", "/player"));
            url.searchParams.set('hostId', id)
            dispatch(setJoinUrl(url.toString()));
        });
        

        peer.on('connection', (conn) => {
            dispatch(addPlayer(conn))
            conn.on('data', processDataHost);
            conn.on('open', () => welcomeNewPlayer(conn.peer));
            conn.on('close', () => informPlayerDisconnected(conn.peer));
        })
        
    }

    function processDataHost (data: unknown) {
        return data;
    }
    function welcomeNewPlayer(playerId: string) {
        return;
    }

    function informPlayerDisconnected(playerId: string) {
        return;
    }

    return (
        <>
            <Title order={1} ta="center">
                Host
                <Text>Explain how things work here</Text>
            </Title>

            <Divider my="xs" label="Setup your browser as the Host" labelPosition="center" />
            <Stack align="center">
                <SegmentedControl 
                    data={['Public Server', 'Private Server']} 
                    value={hostData.hostInfo.serverType}
                    onChange={(value) => dispatch(setServerType(value))}
                />
                {
                    hostData.hostInfo.serverType === 'Private Server' && (
                        <Container style={{ maxWidth: '400px', margin: 'auto', padding: '16px' }}>
                            <TextInput label="Server Name" placeholder="localhost" onChange={(event) => dispatch(setPrivateServer({ name: event.target.value }))} value={privateServerData.name}/>
                            <TextInput label="Port" placeholder="9000" onChange={(event) => dispatch(setPrivateServer({ port: event.target.value }))} value={privateServerData.port}/>
                            <TextInput label="Path" placeholder="/peerServer" onChange={(event) => dispatch(setPrivateServer({ path: event.target.value}))} value={privateServerData.path} />
                        </Container>
                    )
                }
                <Button onClick={registerHost}>Register Host</Button>
            </Stack>

            {hostData.hostInfo.joinUrl && (
                <>
                    <Divider my="xs" label="Friends Scan" labelPosition="center" />
                    <Container style={{ background: 'white', padding: '16px', maxWidth: '288px' }}>
                        <QRCode value={hostData.hostInfo.joinUrl} size={256} level="L" />
                    </Container>
                    <Link to={hostData.hostInfo.joinUrl} target="_blank">
                        <Text>{hostData.hostInfo.joinUrl}</Text>
                    </Link>
                </>
            )}

            <Divider my="xs" label="Players Connected" labelPosition="center" />
            {Object.keys(hostData.players).length === 0 ? (
                <Text>No players connected yet...</Text>
            )
            : (
                <Stack align="center">
                    {Object.keys(hostData.players).map((playerId) => (
                        <Text key={playerId}>{hostData.players[playerId].name || playerId}</Text>
                    ))}
                </Stack>
            )}

            <Divider my="xs" label="Danger Area" labelPosition="center" />
            <Button style={{marginRight: "15px"}}>Start Game</Button>
            <Button onClick={() => dispatch(resetHost())} color="red">Reset Host</Button>
        </>
    );

}