import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <h1>Friend's Game</h1>
      <button onClick={() => navigate('/host')}>Host</button>
      <button onClick={() => navigate('/player')}>Player</button>
    </div>
  );
}