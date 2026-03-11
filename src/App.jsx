import React, { useState } from "react";
import SlideList from "./components/SlideList";
// import Draggable from "react-draggable";
import { Rnd } from "react-rnd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function App() {

  const [slides, setSlides] = useState([
  { id: 1, elements: [], background: "white" }
]);
  const [currentSlide, setCurrentSlide] = useState(1);
const [selectedElement, setSelectedElement] = useState(null);
const [presentMode, setPresentMode] = useState(false);
const [presentSlide, setPresentSlide] = useState(0);
const [history, setHistory] = useState([]);
const [redoStack, setRedoStack] = useState([]);

const addSlide = () => {
  const newSlide = {
    id: slides.length + 1,
    elements: [],
    background: "white"
  };

    setSlides([...slides, newSlide]);
  };
// -------------------------------------------------------------------------------- TXT
  const addText = () => {

    const updatedSlides = slides.map(slide => {
      if (slide.id === currentSlide) {
        return {
          ...slide,
          elements: [
            ...slide.elements,
       
{
  type: "text",
  content: "New Text",
  fontSize: 20,
  color: "#000000",
  bold: false,
  align: "left"
}
          ]
        };
      }
      return slide;
    });

    setSlides(updatedSlides);
  };
// ---------------------------------------------------------------------IMAGES

  const addImage = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const imageURL = URL.createObjectURL(file);
  const updatedSlides = slides.map(slide => {
    if (slide.id === currentSlide) {
      return {
        ...slide,
        elements: [
          ...slide.elements,
          {
            type: "image",
            src: imageURL,
            ref: React.createRef()
          }
        ]
      };
    }
    return slide;
  });
  setSlides(updatedSlides);
};

// --------------------------------------------------------------------------RCTANGLE

const addRectangle = () => {
  const updatedSlides = slides.map(slide => {
    if (slide.id === currentSlide) {
      return {
        ...slide,
        elements: [
          ...slide.elements,
          {
            type: "rectangle",
            color: "#4CAF50"
          }
        ]
      };
    }
    return slide;
  });
  setSlides(updatedSlides);
};

// -------------------------------------------------------------------------------- CIRCLE

const addCircle = () => {
  const updatedSlides = slides.map(slide => {
    if (slide.id === currentSlide) {
      return {
        ...slide,
        elements: [
          ...slide.elements,
          {
            type: "circle",
            color: "#2196F3"
          }
        ]
      };
    }
    return slide;
  });
  setSlides(updatedSlides);
};

// -------------------------------------------------------------------------------- EXPORT PDF

const exportPDF = async () => {
  const slide = document.getElementById("slide-canvas");
  const canvas = await html2canvas(slide);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("landscape");
  pdf.addImage(imgData, "PNG", 10, 10, 270, 150);
  pdf.save("presentation.pdf");
};
// -------------------------------------------------------------------------------- INCREASEFONT

const increaseFont = () => {
  updateTextStyle("fontSize", 5);
};

// -------------------------------------------------------------------------------- DECREASE FONT

const decreaseFont = () => {
  updateTextStyle("fontSize", -5);
};

// -------------------------------------------------------------------------------- BOLD

const toggleBold = () => {
  updateTextStyle("bold");
};

// -------------------------------------------------------------------------------- SAVE THE HISTORY

const saveHistory = (newSlides) => {
  setHistory(prevHistory => [...prevHistory, slides]);
saveHistory(updatedSlides)
  setRedoStack([]);
};
// -------------------------------------------------------------------------------- UNDO

const undo = () => {
  setHistory(prevHistory => {
    if (prevHistory.length === 0) return prevHistory;
    const previous = prevHistory[prevHistory.length - 1];
    setRedoStack(prevRedo => [slides, ...prevRedo]);
    setSlides(previous);
    return prevHistory.slice(0, prevHistory.length - 1);
  });
};

// -------------------------------------------------------------------------------- REDO

const redo = () => {
  setRedoStack(prevRedo => {
    if (prevRedo.length === 0) return prevRedo;
    const next = prevRedo[0];
    setHistory(prevHistory => [...prevHistory, slides]);
    setSlides(next);
    return prevRedo.slice(1);
  });
};

// -------------------------------------------------------------------------------- CHANGE SHAPE COLOR

const changeShapeColor = (e) => {
  if (selectedElement === null) return;
  const updatedSlides = slides.map(slide => {
    if (slide.id === currentSlide) {
      const newElements = slide.elements.map((el, index) => {
        if (index === selectedElement && (el.type === "circle" || el.type === "rectangle")) {
          return { ...el, color: e.target.value };
        }
        return el;
      });
      return { ...slide, elements: newElements };
    }
    return slide;
  });
  setSlides(updatedSlides);
};

// --------------------------------------------------------------------------------CHANGE COLOR TEXT

const changeColor = (e) => {
  updateTextStyle("color", e.target.value);
};
const updateTextStyle = (property, value) => {
  if (selectedElement === null) return;
  const updatedSlides = slides.map(slide => {
    if (slide.id === currentSlide) {
      const newElements = slide.elements.map((el, index) => {
        if (index === selectedElement && el.type === "text") {
          if (property === "bold") {
            return { ...el, bold: !el.bold };
          }
          if (property === "fontSize") {
            return { ...el, fontSize: el.fontSize + value };
          }
          if (property === "color") {
            return { ...el, color: value };
          }
        }
        return el;
      });
      return { ...slide, elements: newElements };
    }
    return slide;
  });
  setSlides(updatedSlides);
};

// -------------------------------------------------------------------------------- SAVE PRESENTATION

const savePresentation = () => {
  const data = JSON.stringify(slides);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "presentation.json";
  a.click();
};

// -------------------------------------------------------------------------------- EXPORT HTML

const exportHTML = () => {
  const slideHTML = document.getElementById("slide-canvas").outerHTML;
  const htmlContent = `
  <html>
  <head>
  <title>Presentation</title>
  </head>
  <body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#ddd;">
  ${slideHTML}
  </body>
  </html>
  `;
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "presentation.html";
  a.click();
};
// -------------------------------------------------------------------------------- CHANGEALIGGNMENT

const changeAlignment = (alignType) => {
  if (selectedElement === null) return;
  const updatedSlides = slides.map(slide => {
    if (slide.id === currentSlide) {
      const newElements = slide.elements.map((el, index) => {
        if (index === selectedElement && el.type === "text") {
          return { ...el, align: alignType };
        }
        return el;
      });
      return { ...slide, elements: newElements };
    }
    return slide;
  });
  setSlides(updatedSlides);
};

// -------------------------------------------------------------------------------- ALIGNMENT

React.useEffect(() => {
  const handleSlideChange = (e) => {
    if (!presentMode) return;
    if (e.key === "ArrowRight") {
      setPresentSlide((prev) =>
        Math.min(prev + 1, slides.length - 1)
      );
    }
    if (e.key === "ArrowLeft") {
      setPresentSlide((prev) =>
        Math.max(prev - 1, 0)
      );
    }
    if (e.key === "Escape") {
      setPresentMode(false);
    }
  };
  window.addEventListener("keydown", handleSlideChange);
  return () =>
    window.removeEventListener("keydown", handleSlideChange);
}, [presentMode, slides]);
// -------------------------------------------------------------------------------- KEYDOWN HANDLING
const changeBackground = (color) => {
  const updatedSlides = slides.map(slide => {
    if (slide.id === currentSlide) {
      return { ...slide, background: color };
    }
    return slide;
  });
  setSlides(updatedSlides);
};
// -------------------------------------------------------------------------------- changebg
React.useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "z") {
  undo();
}
if (e.ctrlKey && e.key === "y") {
  redo();
}
if (e.ctrlKey && e.key === "d") {
  e.preventDefault();
  if (selectedElement === null) return;
  const updatedSlides = slides.map(slide => {
    if (slide.id === currentSlide) {
      const elementToCopy = slide.elements[selectedElement];
      const newElements = [
        ...slide.elements,
        { ...elementToCopy }
      ];
      return {
        ...slide,
        elements: newElements
      };
    }
    return slide;
  });
  setSlides(updatedSlides);
}
    if (e.key === "Delete" && selectedElement !== null) {
      const updatedSlides = slides.map(slide => {
        if (slide.id === currentSlide) {
          const newElements = [...slide.elements];
          newElements.splice(selectedElement, 1);
          return {
            ...slide,
            elements: newElements
          };
        }
        return slide;
      });
      setSlides(updatedSlides);
      setSelectedElement(null);
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [selectedElement, slides, currentSlide]);
 const activeSlide = slides.find(slide => slide.id === currentSlide) || { elements: [] };
if (presentMode) {
  const slide = slides[presentSlide];
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "900px",
          height: "500px",
          background: "white",
          position: "relative"
        }}
      >
        {slide.elements.map((el, index) => (
          <div key={index} style={{ position: "absolute", top: 50, left: 50 }}>
    {el.type === "text" && (
  <div
    style={{
      fontSize: el.fontSize,
      color: el.color,
      fontWeight: el.bold ? "bold" : "normal",
      textAlign: el.align || "left"
    }}
  >
    {el.content}
  </div>
)}
            {el.type === "image" && (
              <img src={el.src} alt="" width="200" />
            )}
            {el.type === "rectangle" && (
              <div
                style={{
                  width: 200,
                  height: 100,
                  background: el.color
                }}
              />
            )}
            {el.type === "circle" && (
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: el.color
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

}
  return (
    
    <div>

      <div
  style={{
    height: "50px",
    background: "#333",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px"
  }}
>


  <button onClick={addText}>Add Text</button>
<button onClick={exportPDF}>Export PDF</button>
<button onClick={exportHTML}>Export HTML</button>
  <input type="file" accept="image/*" onChange={addImage} />

  <button onClick={increaseFont}>A+</button>

  <button onClick={decreaseFont}>A-</button>

  <button onClick={toggleBold}>Bold</button>

  <input type="color" onChange={changeColor} />
<button onClick={addRectangle}>Rectangle</button>
<button onClick={addCircle}>Circle</button>
<input type="color" onChange={changeShapeColor} />
<button onClick={undo}>Undo</button>
<button onClick={redo}>Redo</button>
<button onClick={() => changeBackground("white")}>White</button>
<button onClick={() => changeBackground("#222")}>Dark</button>
<button onClick={() => changeBackground("#2196F3")}>Blue</button>
<button onClick={() => changeBackground("linear-gradient(to right, #ff9966, #ff5e62)")}>
Gradient
</button>
<button onClick={() => changeAlignment("left")}>Left</button>
<button onClick={() => changeAlignment("center")}>Center</button>
<button onClick={() => changeAlignment("right")}>Right</button>

<button onClick={() => {
  setPresentMode(true);
  setPresentSlide(0);
}}> Present </button>
</div>

      <div style={{ display: "flex" }}>
        
        <SlideList
          slides={slides.map(s => s.id)}
          addSlide={addSlide}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />

        <div
          style={{
            flex: 1,
            background: "#ddd",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
           id="slide-canvas"
            style={{
              width: "800px",
              height: "450px",
              background: "white",
              background: activeSlide.background || "white",
              position: "relative",
              border: "2px solid #ccc"
            }}
          >

          {activeSlide.elements.map((el, index) => (
 <Rnd
  key={index}
  default={{
    x: 50,
    y: 50,
    width: 200,
    height: 100
  }}

  onClick={() => setSelectedElement(index)}
  style={{
    border: selectedElement === index ? "2px solid blue" : "none"
  }}
>
  {el.type === "text" && (
  <div
    contentEditable
    suppressContentEditableWarning
    style={{
      width: "100%",
      height: "100%",
      border: "1px dashed gray",
      padding: "5px",
      fontSize: el.fontSize,
      color: el.color,
      fontWeight: el.bold ? "bold" : "normal",
       textAlign: el.align || "left"
    }}
  >
    {el.content}
  </div>
)}

  {el.type === "image" && (
    <img
      src={el.src}
      alt=""
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain"
      }}
    />
  )}
{el.type === "rectangle" && (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: el.color
    }}
  />
)}

{el.type === "circle" && (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: el.color,
      borderRadius: "50%"
    }}
  />
)}
</Rnd>
))}

          </div>
        </div>

      </div>
    </div>
  );
}


export default App;