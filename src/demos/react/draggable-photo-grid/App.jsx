import { useRef, useState } from 'react';
import { PHOTOS } from './photos';
import { usePhotoWall } from './usePhotoWall';
import './index.css';

const LINES = 4;

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const makeLines = () =>
  Array.from({ length: LINES }, (_, i) => ({ id: `line-${i}`, photos: shuffle(PHOTOS) }));

const App = () => {
  const wallRef = useRef(null);
  // Shuffled once, in the initializer: reshuffling on every render would
  // reorder the photos under the cursor.
  const [lines] = useState(makeLines);
  usePhotoWall(wallRef);

  return (
    <section
      ref={wallRef}
      className="photo-wall"
      aria-label="Photo wall. Drag, or use the arrow keys, to pan."
      tabIndex={0}
    >
      {lines.map((line) => (
        <div key={line.id} className="photo-line">
          {line.photos.map((photo) => (
            <div key={photo.src} className="photo">
              <img src={photo.src} alt={photo.alt} draggable={false} />
            </div>
          ))}
        </div>
      ))}
    </section>
  );
};

export default App;
