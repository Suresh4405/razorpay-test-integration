"use client";

import { useRef } from "react";


export default function OtpInput({ value, onChange, length = 6, disabled, id }) {
  const inputsRef = useRef([]);
  const digits = value.padEnd(length, " ").split("").slice(0, length);

  const setDigitAt = (index, char) => {
    const next = value.split("");
    next[index] = char;
    onChange(next.join("").slice(0, length).replace(/\s/g, ""));
  };

  const focusBox = (index) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const handleChange = (index, e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setDigitAt(index, "");
      return;
    }
    const chars = raw.split("");
    let cursor = index;
    const next = value.split("");
    for (const ch of chars) {
      if (cursor >= length) break;
      next[cursor] = ch;
      cursor += 1;
    }
    onChange(next.join("").slice(0, length));
    focusBox(Math.min(cursor, length - 1));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index] && digits[index] !== " ") {
        setDigitAt(index, "");
      } else if (index > 0) {
        focusBox(index - 1);
        setDigitAt(index - 1, "");
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusBox(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      focusBox(index + 1);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    focusBox(Math.min(pasted.length, length - 1));
  };

  return (
    <div className="flex gap-1.5" role="group" aria-label="6-digit verification code">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          id={i === 0 ? id : undefined}
          ref={(el) => (inputsRef.current[i] = el)}
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={digits[i] === " " ? "" : digits[i]}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="h-11 w-9 rounded-md border border-ink/20 bg-paper text-center text-base font-medium tracking-normal text-ink shadow-sm focus:border-brass disabled:opacity-60 sm:h-12 sm:w-10"
        />
      ))}
    </div>
  );
}
