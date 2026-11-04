import { useEffect, useRef } from "react";
import "./marquee.css";

const App = () => {
  const tagScrollerRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery && !mediaQuery.matches) {
      const tagScroller = tagScrollerRef.current;
      // StrictMode runs this effect twice; the second pass would clone the clones.
      if (tagScroller.classList.contains("scrolling")) return;
      const allTags = tagScroller.querySelectorAll("li");

      const createElement = (tagName, className = "") => {
        const elem = document.createElement(tagName);
        elem.className = className;
        return elem;
      };

      const scrollersFrom = (elements, numColumns = 2) => {
        const fragment = new DocumentFragment();
        elements.forEach((element, i) => {
          const column = i % numColumns;
          const children = fragment.children;
          if (!children[column])
            fragment.appendChild(createElement("ul", "tag-list"));
          children[column].appendChild(element);
        });
        return fragment;
      };

      const addScrolling = () => {
        tagScroller.classList.add("scrolling");
        document.querySelectorAll(".tag-list").forEach((tagList) => {
          const scrollContent = Array.from(tagList.children);
          scrollContent.forEach((listItem) => {
            const clonedItem = listItem.cloneNode(true);
            clonedItem.setAttribute("aria-hidden", true);
            tagList.appendChild(clonedItem);
          });
          tagList.style.setProperty(
            "--duration",
            tagList.clientWidth / 100 + "s"
          );
        });
      };

      const scrollers = scrollersFrom(allTags, 1);
      tagScroller.innerHTML = "";
      tagScroller.appendChild(scrollers);
      addScrolling();
    }
  }, []);

  return (
    <div className="tag-scrollers">
      <div className="tag-scroller" ref={tagScrollerRef}>
        <ul className="tag-list">
          <li>THE PULSE OF YOUNG INNOVATION</li>
          <li>THE PULSE OF YOUNG INNOVATION</li>
          <li>THE PULSE OF YOUNG INNOVATION</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
