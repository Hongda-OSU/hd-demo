import { useTypingText } from './useTypingText';
import './index.css';

// Module scope, not inline — a new array each render would restart the effect.
const WORDS = ['Basketball...', 'Tennis...', 'Volleyball...'];

export default function App() {
  const text = useTypingText(WORDS);

  return (
    <section className="typing-container">
      <p>
        I LOVE{' '}
        <span className="typing-text" aria-live="polite">
          {text}
        </span>
      </p>
    </section>
  );
}
