import { useTilt } from './useTilt';
import './index.css';

// The stage, not body, carries the perspective: in React the card's parent
// is a div inside #root, and perspective only reaches direct children.
const App = () => {
  const { cardRef, cardStyle, onPointerMove, onPointerLeave } = useTilt();

  return (
    <main className="holo-stage" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div ref={cardRef} className="holo-card" style={cardStyle}>
        <div className="holo-card-art" />
      </div>
    </main>
  );
};

export default App;
