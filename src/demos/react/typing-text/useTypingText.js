import { useEffect, useState } from 'react';

const TYPE_DELAY = 75;
const WORD_PAUSE = 2000;

// Types a word out, pauses, deletes it, moves to the next — forever.
// With reduced motion it shows each whole word in turn instead.
export const useTypingText = (words) => {
  const [text, setText] = useState('');

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    let wordIndex = 0;
    let letterIndex = 0;
    let deleting = false;
    let timerId;

    const tick = () => {
      if (reduceMotion) {
        setText(words[wordIndex]);
        wordIndex = (wordIndex + 1) % words.length;
        timerId = setTimeout(tick, WORD_PAUSE);
        return;
      }

      const word = words[wordIndex];
      const atEnd = !deleting && letterIndex === word.length;
      const atStart = deleting && letterIndex === 0;

      if (atEnd) {
        deleting = true;
      } else if (atStart) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      } else {
        letterIndex += deleting ? -1 : 1;
      }

      setText(words[wordIndex].slice(0, letterIndex));
      timerId = setTimeout(tick, atEnd ? WORD_PAUSE : TYPE_DELAY);
    };

    tick();
    return () => clearTimeout(timerId);
  }, [words]);

  return text;
};
