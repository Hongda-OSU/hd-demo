import { useTypingText } from './useTypingText';
import './index.css';

// Module scope, not inline — a new array each render would restart the effect.
const WORDS = ['Basketball...', 'Tennis...', 'Volleyball...'];

const App = () => {
  const text = useTypingText(WORDS);

  // Screen readers get the sentence once. The animation is hidden from them:
  // as a live region it would be read out again on every keystroke.
  return (
    <section className="typing-container">
      <p>
        <span className="visually-hidden">
          I love basketball, tennis and volleyball.
        </span>
        <span aria-hidden="true">
          I LOVE <span className="typing-text">{text}</span>
        </span>
      </p>
    </section>
  );
};

export default App;
