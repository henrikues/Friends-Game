import { use, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeMessage, selectHostData } from "../../slices/hostSlice";
import { selectPlayerData } from "../../slices/playerSlice";

const BOARD_SIZE = 800; // px
const SQUARES_PER_SIDE = 10;
const SQUARE_SIZE = BOARD_SIZE / SQUARES_PER_SIDE;

function getBoardSquares() {
  const squares = [];
  // Bottom row (left to right)
  for (let i = 0; i < SQUARES_PER_SIDE; i++) {
    squares.push({ x: BOARD_SIZE - (i + 0.5) * SQUARE_SIZE, y: BOARD_SIZE - SQUARE_SIZE / 2 });
  }
  // Left column (bottom to top)
  for (let i = 1; i < SQUARES_PER_SIDE; i++) {
    squares.push({ x: SQUARE_SIZE / 2, y: BOARD_SIZE - (i + 0.5) * SQUARE_SIZE });
  }
  // Top row (right to left)
  for (let i = 1; i < SQUARES_PER_SIDE; i++) {
    squares.push({ x: (i + 0.5) * SQUARE_SIZE, y: SQUARE_SIZE / 2 });
  }
  // Right column (top to bottom)
  for (let i = 1; i < SQUARES_PER_SIDE - 1; i++) {
    squares.push({ x: BOARD_SIZE - SQUARE_SIZE / 2, y: (i + 0.5) * SQUARE_SIZE });
  }
  return squares;
}

function drawBoard(ctx: CanvasRenderingContext2D, squares: {x: number, y: number}[]) {
  ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, BOARD_SIZE, BOARD_SIZE);

  // Draw squares
  for (let i = 0; i < squares.length; i++) {
    let { x, y } = squares[i];
    // Calculate top-left for each square
    let angle = i < 10 ? 0 : i < 20 ? Math.PI / 2 : i < 30 ? Math.PI : 3 * Math.PI / 2;
    let tx = x - SQUARE_SIZE / 2;
    let ty = y - SQUARE_SIZE / 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = "#888";
    ctx.strokeRect(-SQUARE_SIZE / 2, -SQUARE_SIZE / 2, SQUARE_SIZE, SQUARE_SIZE);
    ctx.restore();
    // Draw square number
    ctx.save();
    ctx.fillStyle = "#444";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(i.toString(), x, y);
    ctx.restore();
  }
}

function Game(props: any) {
  const { peerRef, canvasRef, connectionsRef } = props;
  const hostData = useSelector(selectHostData);
  const dispatch = useDispatch();
  const intervalRef = useRef(0);

  const [squareCenters] = useState(getBoardSquares());
  const [playerPos, setPlayerPos] = useState(0); // Track player's current square

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    //beginnings of some animation like effects.
    let isFacingRight = true;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
        drawBoard(ctx, squareCenters);
        // Draw player at current position
        ctx.beginPath();
        ctx.arc(squareCenters[playerPos].x + (isFacingRight ? 10 : -10), squareCenters[playerPos].y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        isFacingRight = !isFacingRight;
    }, 1000);
  }, [canvasRef, squareCenters, playerPos]); // Redraw when playerPos changes

  useEffect(() => {
    // Listen for messages from hosthost
    if (hostData.messages.length > 0) {
        const curMessage = JSON.parse(hostData.messages[0]);
        switch (curMessage.type) {
            case 'message':
                alert(`${curMessage.content}`);
                break;
            case 'move':
                movePlayer();
                break;
        }
        dispatch(removeMessage());
    }
  }, [hostData.messages.length])

  // Move player to next square (wrap around at end)
  const movePlayer = () => {
    setPlayerPos((prev) => (prev + 1) % squareCenters.length);
  };

  return (
    <div>
      <h1>Game Component</h1>
      <p>This is where the game logic will be implemented.</p>
      <canvas
        ref={canvasRef}
        width={BOARD_SIZE}
        height={BOARD_SIZE}
        style={{ border: "1px solid black", width: BOARD_SIZE, height: BOARD_SIZE }}
      ></canvas>
      {hostData.messages.map((message: any, index: any) => (
        <div key={index}>
          <p>{message.toString()}</p>
        </div>
      ))}
    </div>
  );
}

export default Game;
