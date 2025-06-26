import { useLayoutEffect, useState } from "react";

function useDynamicFont(
  ref: React.RefObject<HTMLElement | null>,
  dependencies: any[],
  minSize: number,
  maxSize: number
) {
  const [fontSize, setFontSize] = useState(maxSize);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const parent = element.parentElement;
    if (!parent) return;

    const resizeText = () => {
      const parentWidth = parent.clientWidth;
      let size = maxSize;
      element.style.fontSize = `${size}px`;
      let contentWidth = element.scrollWidth;

     
      while (contentWidth > parentWidth && size > minSize) {
        size -= 1;
        element.style.fontSize = `${size}px`;
        contentWidth = element.scrollWidth;
      }

     
      while (contentWidth < parentWidth && size < maxSize) {
        const nextSize = size + 1;
        element.style.fontSize = `${nextSize}px`;
        if (element.scrollWidth <= parentWidth) {
          size = nextSize;
          contentWidth = element.scrollWidth;
        } else break;
      }

      setFontSize(size);
    };

   
    resizeText();

   
    const observer = new ResizeObserver(resizeText);
    observer.observe(parent);
    window.addEventListener("resize", resizeText);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeText);
    };
  }, dependencies);

  return fontSize;
}


export default useDynamicFont;