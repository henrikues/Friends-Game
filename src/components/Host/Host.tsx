import { Title, Text, SegmentedControl, Divider, Container, Button, TextInput, Stack } from "@mantine/core";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, addPlayer, resetHost, selectHostData, selectPrivateServerData, setHostId, setJoinUrl, setPrivateServer, setServerType } from "../../slices/hostSlice";
import Peer from "peerjs";
import { Link, useNavigate } from "react-router-dom";
import { registerHost } from "../../helpers/connectionTools";

export function Host(props: any) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const hostData = useSelector(selectHostData);
    const privateServerData = useSelector(selectPrivateServerData);
    const { peerRef, connectionsRef } = props;

    function onData(data: unknown) {
        dispatch(addMessage(JSON.stringify(data)));
    }
    function onOpen(playerId: string) {
        broadcastMessage(`Welcome ${playerId} to the game!`);
        return;
    }

    function onClose(playerId: string) {
        alert(`Goodbye ${playerId}`);
        return;
    }

    function broadcastMessage(message: string) {
        const conns = connectionsRef.current;
        Object.keys(conns).map((key: string) =>
            conns[key].send({
                type: 'message',
                content: message,
            })
        );
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
                            <TextInput label="Server Name" placeholder="localhost" onChange={(event) => dispatch(setPrivateServer({ name: event.target.value }))} value={privateServerData.name} />
                            <TextInput label="Port" placeholder="9000" onChange={(event) => dispatch(setPrivateServer({ port: event.target.value }))} value={privateServerData.port} />
                            <TextInput label="Path" placeholder="/peerServer" onChange={(event) => dispatch(setPrivateServer({ path: event.target.value }))} value={privateServerData.path} />
                        </Container>
                    )
                }
                <Button onClick={
                    () => registerHost(
                        hostData
                        , peerRef
                        , connectionsRef
                        , onOpen
                        , onClose
                        , onData
                        , dispatch
                        , privateServerData
                    )}
                >
                        Register Host
                </Button>
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
                            <Text key={playerId}>{hostData.players[playerId].name + " - " + playerId}</Text>
                        ))}
                    </Stack>
                )}

            <Divider my="xs" label="Danger Area" labelPosition="center" />
            <Button onClick={() => navigate('/game')} style={{ marginRight: "15px" }}>Start Game</Button>
            <Button onClick={() => dispatch(resetHost())} color="red">Reset Host</Button>
            <Button onClick={() => broadcastMessage("Hello!")} color="red">Broadcast</Button>
        </>
    );

}