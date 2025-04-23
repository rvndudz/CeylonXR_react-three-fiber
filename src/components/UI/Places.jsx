import React, { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import VoiceAssistant from "./VoiceAssistant";

export const BentoTilt = ({ children, className = "", onClick }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: transformStyle,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
};

export const Card = ({
  src,
  title,
  description,
  isComingSoon,
  onClick,
  showVoiceAssistant,
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();
    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div
      className="relative size-full"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {/* Image */}
      <img
        src={src}
        alt={title}
        className="absolute left-0 top-0 size-full object-cover object-center"
      />

      {/* Voice Assistant */}
      {showVoiceAssistant && <VoiceAssistant />}

      {/* Diagonal Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>

        <div
          ref={hoverButtonRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/90"
        >
          {/* Radial gradient hover effect */}
          <div
            className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
            style={{
              opacity: hoverOpacity,
              background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
            }}
          />
          <TiLocationArrow className="relative z-20" />
          {isComingSoon ? (
            <p className="relative z-20">coming soon</p>
          ) : (
            <p className="relative z-20">Ready to explore? Let’s dive in! 🚀</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Places = () => {
  const navigate = useNavigate();

  // Function to open PlayCanvas with voice assistant
  const openPlayCanvasWithVoiceAssistant = () => {
    const playCanvasWindow = window.open(
      "/playcanvas-app/index.html",
      "_blank"
    );

    // When the window loads, inject our voice assistant script
    if (playCanvasWindow) {
      playCanvasWindow.addEventListener("load", () => {
        const script = playCanvasWindow.document.createElement("script");
        script.src = "/playcanvas-app/voice-assistant.js";
        playCanvasWindow.document.body.appendChild(script);
      });
    }
  };

  return (
    <section className="bg-black pb-52">
      <div className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32">
          <p className="font-circular-web text-lg text-blue-50">
            Into the Gaussian Splats!
          </p>
          <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
            Explore stunning digital recreations of real-world sites, enriched
            with historical insights, interactive storytelling, and multiplayer
            discovery.
          </p>
        </div>

        {/* Ella Card */}
        <BentoTilt
          className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]"
          onClick={() => navigate("/ella")}
        >
          <Card
            src="img/ella.webp"
            title={<>Ella</>}
            description="Nestled in the lush hills of Sri Lanka, Ella is a breathtaking escape filled with misty mountains, scenic tea plantations, and iconic landmarks like Nine Arches Bridge, Little Adam’s Peak, and Ravana Falls. A land of adventure, history, and wonder, Ella invites you to explore its rich culture and natural beauty."
            isComingSoon={false}
          />
        </BentoTilt>

        <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
          <BentoTilt
            className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2"
            onClick={() => navigate("/sigiriya")}
          >
            <Card
              src="img/sigiriya.webp"
              title={<>sigiriya</>}
              description="Perched on a towering rock, Sigiriya is an ancient fortress filled with stunning frescoes, landscaped gardens, and the iconic Lion’s Paw entrance. A UNESCO World Heritage site, it offers a glimpse into Sri Lanka's rich history and breathtaking views from its summit."
              isComingSoon={true} // mark as coming soon if needed.
            />
          </BentoTilt>

          <BentoTilt
            className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0"
            onClick={openPlayCanvasWithVoiceAssistant}
          >
            <Card
              src="img/test.webp"
              title={<>test</>}
              description="test purposes"
              isComingSoon={false}
              showVoiceAssistant={true}
            />
          </BentoTilt>

          <BentoTilt
            className="bento-tilt_1 me-14 md:col-span-1 md:me-0"
            onClick={() => navigate("/test2")}
          >
            <Card
              src="img/test2.webp"
              title={<>test2</>}
              description="test purposes"
              isComingSoon={true}
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt_2">
            <div className="flex size-full flex-col justify-between bg-blue-300 p-5">
              <h1 className="bento-title special-font max-w-64 text-black">
                More coming soon.
              </h1>
              <TiLocationArrow className="m-5 scale-[5] self-end" />
            </div>
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};

export default Places;
