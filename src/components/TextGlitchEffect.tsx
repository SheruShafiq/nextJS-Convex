import React, { useEffect, useRef } from "react";

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const SPECIAL_CHARS = "~`!@#$%^&*()-+=/*[]{}:<>?";
const NUMBERS = "0123456789";

const TYPES = {
  ALPHABETS: "alphabets",
  NUMBERS: "numbers",
  SPECIAL_CHARS: "specialchars",
  ALPHA_NUMERIC: "ALPHA_NUMERIC",
};

type GlitchEffectProps = {
  text: string;
  speed?: number;
  letterCase?: "uppercase" | "lowercase";
  className?: string;
  type?: keyof typeof TYPES;
};

export const TextGlitchEffect: React.FC<GlitchEffectProps> = ({
  text,
  speed = 30,
  letterCase = "uppercase",
  className,
  type = "ALPHA_NUMERIC",
}) => {
  const intervalRef = useRef<number | null>(null);
  const textElementRef = useRef<HTMLDivElement | null>(null);

  const startGlitchEffect = (event: { target: HTMLDivElement }) => {
    let iteration = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      event.target.innerText = event.target.innerText
        .split("")
        .map((alphabet, index) => {
          if (index < iteration) {
            return event.target.dataset.value![index];
          }

          let letters = "";

          switch (type) {
            case TYPES.ALPHABETS:
              letters = LETTERS;
              break;
            case TYPES.NUMBERS:
              letters = NUMBERS;
              break;
            case TYPES.SPECIAL_CHARS:
              letters = SPECIAL_CHARS;
              break;
            case TYPES.ALPHA_NUMERIC:
              letters = LETTERS + NUMBERS;
              break;
            default:
              letters = LETTERS;
          }

          const individualLetter =
            letters[Math.floor(Math.random() * letters.length)];

          return letterCase === "uppercase"
            ? individualLetter.toUpperCase()
            : individualLetter.toLowerCase();
        })
        .join("");

      if (iteration >= (event.target.dataset.value?.length ?? 0)) {
        clearInterval(intervalRef.current!);
      }

      iteration += 1 / 3;
    }, speed);
  };

  useEffect(() => {
    if (textElementRef.current) {
      startGlitchEffect({ target: textElementRef.current });
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  useEffect(() => {
    if (textElementRef.current) {
      startGlitchEffect({ target: textElementRef.current });
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      ref={textElementRef}
      data-value={text}
      className={className}
      style={{
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {text}
    </div>
  );
};
