import React from "react";

function SlideList({ slides, addSlide, currentSlide, setCurrentSlide }) {
  return (
    <div
      style={{
        width: "200px",
        background: "#f1f1f1",
        height: "100vh",
        padding: "10px",
      }}
    >
      <h3>Slides</h3>

      {slides.map((slide) => (
        <div
          key={slide}
          onClick={() => setCurrentSlide(slide)}
          style={{
            background: currentSlide === slide ? "#d0d0ff" : "white",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            cursor: "pointer"
          }}
        >
          Slide {slide}
        </div>
      ))}

      <button onClick={addSlide}>Add Slide</button>
    </div>
  );
}

export default SlideList;