"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function NavAvatar() {
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const eyes = [leftPupilRef.current, rightPupilRef.current];

      eyes.forEach((eye) => {
        if (!eye) return;

        const rect = eye.getBoundingClientRect();
        const x = (rect.left + rect.right) / 2;
        const y = (rect.top + rect.bottom) / 2;

        const rad = Math.atan2(e.pageX - x, e.pageY - y);
        const rot = rad * (180 / Math.PI) * -1 + 180;

        eye.style.transform = `rotate(${rot}deg)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="logo">
      <div className="logo-top" tabIndex={0} aria-label="avatar logo">
        <Image
          src="/png/nav-avatar.png"
          alt="animation-head"
          id="nav-avatar"
          width={80}
          height={80}
          priority
        />
        <div className="face">
          <div className="eye left-eye">
            <div className="pupil" ref={leftPupilRef}></div>
          </div>
          <div className="eye right-eye">
            <div className="pupil" ref={rightPupilRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
