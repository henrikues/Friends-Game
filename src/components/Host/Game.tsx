import { useSelector } from "react-redux";
import { selectHostData } from "../../slices/hostSlice";
import { selectPlayerData } from "../../slices/playerSlice";

function Game(props:any) {
    const { peerRef } = props;
    const hostData = useSelector(selectHostData);
    
    return (
        <div>
            <h1>Game Component</h1>
            <p>This is where the game logic will be implemented.</p>
            {hostData.messages.map((message:any, index:any) => (
                <div>
                    <p>{message.toString()}</p>
                </div>
            ))}
        </div>
    );
}
export default Game;