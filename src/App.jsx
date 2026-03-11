import React, { useState } from "react";
import SlideList from "./components/SlideList";
// import Draggable from "react-draggable";
import { Rnd } from "react-rnd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function App() {

  const [slides, setSlides] = useState([
  { id: 1, elements: [], background: "white", layout: "blank" }
]);
  const [currentSlide, setCurrentSlide] = useState(1);
const [selectedElement, setSelectedElement] = useState(null);
const [presentMode, setPresentMode] = useState(false);
const [presentSlide, setPresentSlide] = useState(0);
const [history, setHistory] = useState([]);
const [redoStack, setRedoStack] = useState([]);
const [showFileMenu, setShowFileMenu] = useState(false);
const [showInsertMenu, setShowInsertMenu] = useState(false);
const [showFormatMenu, setShowFormatMenu] = useState(false);
const [showViewMenu, setShowViewMenu] = useState(false);
const [showHome, setShowHome] = useState(false);
const [showInsert, setShowInsert] = useState(false);
const [showDesign, setShowDesign] = useState(false);
const [showAnimations, setShowAnimations] = useState(false);
const [showView, setShowView] = useState(false);
const [activeTab, setActiveTab] = useState("Home");
const addSlide = () => {
  const newSlide = {
    id: slides.length + 1,
    elements: [],
    background: "white",
      layout: "blank"
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

//   const addImage = (event) => {
//   const file = event.target.files[0];
//   if (!file) return;
//   const imageURL = URL.createObjectURL(file);
//   const updatedSlides = slides.map(slide => {
//     if (slide.id === currentSlide) {
//       return {
//         ...slide,
//         elements: [
//           ...slide.elements,
//           {
//             type: "image",
//             src: imageURL,
//             ref: React.createRef()
//           }
//         ]
//       };
//     }
//     return slide;
//   });
//   setSlides(updatedSlides);
// };

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
  setSlides(newSlides);
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

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "presentation.json";
  link.click();
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
            width: 200,
            height: 150
          }
        ]
      };
    }
    return slide;
  });

  setSlides(updatedSlides);
};

const addVideo = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const videoURL = URL.createObjectURL(file);

  const updatedSlides = slides.map(slide => {
    if (slide.id === currentSlide) {
      return {
        ...slide,
        elements: [
          ...slide.elements,
          {
            type: "video",
            src: videoURL,
            width: 300,
            height: 200
          }
        ]
      };
    }
    return slide;
  });

  setSlides(updatedSlides);
};

const addAudio = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const audioURL = URL.createObjectURL(file);

  const updatedSlides = slides.map(slide => {
    if (slide.id === currentSlide) {
      return {
        ...slide,
        elements: [
          ...slide.elements,
          {
            type: "audio",
            src: audioURL,
            width: 300,
            height: 50
          }
        ]
      };
    }
    return slide;
  });

  setSlides(updatedSlides);
};
// Add Table
 // ----------------------- TABLE
  const addTable = (rows = 2, cols = 2) => {
    const newTable = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ""));
    const updatedSlides = slides.map(slide => {
      if (slide.id === currentSlide) {
        return { ...slide, elements: [...slide.elements, { type: "table", data: newTable }] };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  const addTableRow = index => {
    const updatedSlides = slides.map(slide => {
      if (slide.id === currentSlide) {
        const newElements = slide.elements.map((el, i) => {
          if (i === index && el.type === "table") {
            return { ...el, data: [...el.data, Array(el.data[0].length).fill("")] };
          }
          return el;
        });
        return { ...slide, elements: newElements };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  const removeTableRow = index => {
    const updatedSlides = slides.map(slide => {
      if (slide.id === currentSlide) {
        const newElements = slide.elements.map((el, i) => {
          if (i === index && el.type === "table" && el.data.length > 1) {
            return { ...el, data: el.data.slice(0, -1) };
          }
          return el;
        });
        return { ...slide, elements: newElements };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  const addTableColumn = index => {
    const updatedSlides = slides.map(slide => {
      if (slide.id === currentSlide) {
        const newElements = slide.elements.map((el, i) => {
          if (i === index && el.type === "table") {
            return { ...el, data: el.data.map(row => [...row, ""]) };
          }
          return el;
        });
        return { ...slide, elements: newElements };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  const removeTableColumn = index => {
    const updatedSlides = slides.map(slide => {
      if (slide.id === currentSlide) {
        const newElements = slide.elements.map((el, i) => {
          if (i === index && el.type === "table" && el.data[0].length > 1) {
            return { ...el, data: el.data.map(row => row.slice(0, -1)) };
          }
          return el;
        });
        return { ...slide, elements: newElements };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  // ----------------------- CHART
  const addChart = () => {
    const newChart = { type: "chart", chartType: "bar", labels: ["Jan", "Feb"], data: [10, 15], title: "Chart" };
    const updatedSlides = slides.map(slide => {
      if (slide.id === currentSlide) {
        return { ...slide, elements: [...slide.elements, newChart] };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  const changeChartType = (index, chartType) => {
    const updatedSlides = slides.map(slide => {
      if (slide.id === currentSlide) {
        const newElements = slide.elements.map((el, i) => {
          if (i === index && el.type === "chart") {
            return { ...el, chartType };
          }
          return el;
        });
        return { ...slide, elements: newElements };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  const addChartData = index => {
    const updatedSlides = slides.map(slide => {
      if (slide.id === currentSlide) {
        const newElements = slide.elements.map((el, i) => {
          if (i === index && el.type === "chart") {
            return {
              ...el,
              labels: [...el.labels, `Label ${el.labels.length + 1}`],
              data: [...el.data, 0]
            };
          }
          return el;
        });
        return { ...slide, elements: newElements };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

  const removeChartData = index => {
    const updatedSlides = slides.map(slide => {
      if (slide.id === currentSlide) {
        const newElements = slide.elements.map((el, i) => {
          if (i === index && el.type === "chart" && el.data.length > 1) {
            return { ...el, labels: el.labels.slice(0, -1), data: el.data.slice(0, -1) };
          }
          return el;
        });
        return { ...slide, elements: newElements };
      }
      return slide;
    });
    setSlides(updatedSlides);
  };

// ---------------------------------------------------------------------------------------
const renderElementContent = (el) => {
  if (el.type === "text") {
    return (
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
    );
  }
  if (el.type === "image") {
    return <img src={el.src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />;
  }
  if (el.type === "rectangle" || el.type === "circle") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: el.color,
          borderRadius: el.type === "circle" ? "50%" : "0"
        }}
      />
    );
  }
};
// ----------------------------------------------------------
const changeLayout = (layoutType) => {
  const updatedSlides = slides.map(slide => {
    if (slide.id === currentSlide) {
      if (layoutType === "title") {
        return {
          ...slide,
          layout: "title",
          elements: [
            {
              type: "text",
              content: "Title",
              fontSize: 40,
              bold: true,
              align: "center"
            }
          ]
        };
      }
      if (layoutType === "two-column") {
        return {
          ...slide,
          layout: "two-column",
          elements: [
            { type: "text", content: "Left Content", fontSize: 20 },
            { type: "text", content: "Right Content", fontSize: 20 }
          ]
        };
      }
      return { ...slide, layout: "blank", elements: [] };
    }
    return slide;
  });
  setSlides(updatedSlides);
};

// ----------------------------------------------------------------------------CHANGE LAYOUT
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
const changeAnimation = (animationType) => {
  const updatedSlides = slides.map(slide => {
    if (slide.id === currentSlide) {
      const updatedElements = slide.elements.map((el, index) => {
        if (index === selectedElement) {
          return { ...el, animation: animationType }
        }
        return el
      })
      return { ...slide, elements: updatedElements }
    }
    return slide
  })
  setSlides(updatedSlides)
}
// -------------------------------------------------------------animation
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
const menuStyle = {
  position: "absolute",
  top: "50px",
  background: "white",
  border: "1px solid gray",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  zIndex: 1000
};
// ------------------------------------------------menu stlye
const ribbonMenuStyle = {
  position: "absolute",
  top: "50px",
  background: "white",
  border: "1px solid #aaa",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  zIndex: 1000,
  minWidth: "150px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
};
// --------------------------------------------------ribbon style
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
      textAlign: el.align || "left",
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
{/* ------------------------------------------------------------------------------------------ */}
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
<div
  style={{
    position: "relative",
    display: "flex",
    gap: "10px",
    padding: "10px"
  }}
>

  <button onClick={() => setShowFileMenu(!showFileMenu)}>
    File
  </button>

  {showFileMenu && (
    <div
      style={{
        position: "absolute",
        top: "40px",
        left: "0px",
        background: "white",
        border: "1px solid #aaa",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        width: "150px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        zIndex: 1000
      }}
    >
     <button type="button" onClick={savePresentation}>Save</button>
<button type="button" onClick={savePresentation}>Save As</button>
<button type="button" onClick={exportPDF}>Export PDF</button>
<button type="button" onClick={exportHTML}>Export HTML</button>
    </div>
  )}
</div>

<button type="button" onClick={() => setShowInsertMenu(!showInsertMenu)}>
  Insert
</button>

{showInsertMenu && (
  <div style={{...menuStyle, left:"80px"}}>
    <button onClick={addText}>Text</button>
    <input type="file" accept="image/*" onChange={addImage} />
    <button onClick={addRectangle}>Rectangle</button>
    <button onClick={addCircle}>Circle</button>
   <button onClick={addTable}>Add Table</button>
{selectedElement !== null && (
  <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
    <button
      onClick={() => {
        const url = prompt("Enter URL to link this element:");
        if (!url) return;
        const updatedSlides = slides.map(slide => {
          if (slide.id === currentSlide) {
            const newElements = slide.elements.map((el, index) => {
              if (index === selectedElement) {
                return { ...el, link: url };
              }
              return el;
            });
            return { ...slide, elements: newElements };
          }
          return slide;
        });
        setSlides(updatedSlides);
      }}
    >
      Add Link
    </button>

<button onClick={addChart}>Add Chart</button>
    {/* Images */}
<input
  type="file"
  accept="image/*"
  style={{ display: "none" }}
  id="image-upload"
  onChange={addImage}
/>
<label htmlFor="image-upload" style={{ pposition: "absolute",
  top: "50px",
  background: "white",
  border: "1px solid gray",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  color: "black",
  zIndex: 1000 }}>
  🖼 Image
</label>

{/* Video */}
<input
  type="file"
  accept="video/*"
  style={{ display: "none" }}
  id="video-upload"
  onChange={addVideo}
/>
<label htmlFor="video-upload" style={{ cursor: "pointer",color: "black", padding: "5px", border: "1px solid #ccc" }}>
  🎬 Video
</label>

{/* Audio */}
<input
  type="file"
  accept="audio/*"
  style={{ display: "none" }}
  id="audio-upload"
  onChange={addAudio}
/>
<label htmlFor="audio-upload" style={{ cursor: "pointer", color: "black" ,padding: "5px", border: "1px solid #ccc" }}>
  🎵 Audio
</label>
  </div>
)}
<button type="button" onClick={() => setShowFormatMenu(!showFormatMenu)}>
  Format
</button>

{showFormatMenu && (
  <div style={{...menuStyle, left:"160px"}}>
    <button onClick={increaseFont}>A+</button>
    <button onClick={decreaseFont}>A-</button>
    <button onClick={toggleBold}>Bold</button>
    <input type="color" onChange={changeColor}/>
    <input type="color" onChange={changeShapeColor}/>
  </div>
)}
<div
  style={{
    height: "60px",
    background: "#333",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "0 10px",
    position: "relative",
    fontSize: "14px"
  }}
>
  {/* Home */}
  <div style={{ position: "relative" }}>
    <button onClick={() => setShowHome(!showHome)}>Home</button>
    {showHome && (
      <div style={ribbonMenuStyle}>
        <button onClick={addText}>Add Text</button>
        <button onClick={addRectangle}>Rectangle</button>
        <button onClick={addCircle}>Circle</button>
        <button onClick={increaseFont}>A+</button>
        <button onClick={decreaseFont}>A-</button>
        <button onClick={toggleBold}>Bold</button>
        <input type="color" onChange={changeColor} />
        <input type="color" onChange={changeShapeColor} />
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>
    )}
  </div>

  {/* Insert */}
  <div style={{ position: "relative" }}>
    <button onClick={() => setShowInsert(!showInsert)}>Insert</button>
    {showInsert && (
      <div style={{ ...ribbonMenuStyle, left: "0px" }}>
        <input type="file" accept="image/*" onChange={addImage} />
      </div>
    )}
  </div>

  {/* Design / Background */}
  <div style={{ position: "relative" }}>
    <button onClick={() => setShowDesign(!showDesign)}>Design</button>
    {showDesign && (
      <div style={{ ...ribbonMenuStyle, left: "0px" }}>
        <button onClick={() => changeBackground("white")}>White</button>
        <button onClick={() => changeBackground("#222")}>Dark</button>
        <button onClick={() => changeBackground("#2196F3")}>Blue</button>
        <button onClick={() => changeBackground("linear-gradient(to right, #ff9966, #ff5e62)")}>
          Gradient
        </button>
      </div>
    )}
  </div>

  {/* Animations */}
  <div style={{ position: "relative" }}>
    <button onClick={() => setShowAnimations(!showAnimations)}>Animations</button>
    {showAnimations && (
      <div style={{ ...ribbonMenuStyle, left: "0px" }}>
        <button onClick={() => changeAnimation("fade")}>Fade</button>
        <button onClick={() => changeAnimation("zoom")}>Zoom</button>
        <button onClick={() => changeAnimation("slide")}>Slide</button>
      </div>
    )}
  </div>

  {/* View / Alignment / Layout */}
  <div style={{ position: "relative" }}>
    <button onClick={() => setShowView(!showView)}>View</button>
    {showView && (
      <div style={{ ...ribbonMenuStyle, left: "0px" }}>
        <button onClick={() => changeAlignment("left")}>Left</button>
        <button onClick={() => changeAlignment("center")}>Center</button>
        <button onClick={() => changeAlignment("right")}>Right</button>
        <button onClick={() => changeLayout("title")}>Title Slide</button>
        <button onClick={() => changeLayout("two-column")}>Two Columns</button>
        <button onClick={() => changeLayout("blank")}>Blank Slide</button>
        <button
          onClick={() => {
            setPresentMode(true);
            setPresentSlide(0);
          }}
        >
          Present
        </button>
      </div>
    )}
  </div>
</div>
{/* 
 <button onClick={undo}>Undo</button>
<button onClick={redo}>Redo</button>
<button onClick={() => changeBackground("white")}>White</button>
<button onClick={() => changeBackground("#222")}>Dark</button>
<button onClick={() => changeBackground("#2196F3")}>Blue</button>
<button onClick={() => changeBackground("linear-gradient(to right, #ff9966, #ff5e62)")}>
Gradient
</button>
<button onClick={() => changeAnimation("fade")}>Fade</button>
<button onClick={() => changeAnimation("zoom")}>Zoom</button>
<button onClick={() => changeAnimation("slide")}>Slide</button>
<button onClick={() => changeAlignment("left")}>Left</button>
<button onClick={() => changeAlignment("center")}>Center</button>
<button onClick={() => changeAlignment("right")}>Right</button>
<button onClick={() => changeLayout("title")}>Title Slide</button>

<button onClick={() => changeLayout("two-column")}>Two Columns</button>

<button onClick={() => changeLayout("blank")}>Blank Slide</button>
<button onClick={() => {
  setPresentMode(true);
  setPresentSlide(0);
}}> Present </button>*/}
</div>  
{/* ----------------------------------------------------------------------------------------- */}
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
  default={{ x: 50, y: 50, width: 200, height: 100 }}
  onClick={() => setSelectedElement(index)}
  style={{ border: selectedElement === index ? "2px solid blue" : "none" }}
>
  {el.link ? (
    <a href={el.link} target="_blank" rel="noopener noreferrer" style={{ width: "100%", height: "100%", display: "block" }}>
      {renderElementContent(el)}
    </a>
  ) : (
    renderElementContent(el)
  )}
  {/* key={index}
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
> */}
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
       textAlign: el.align || "left",
      animation:
  el.animation === "fade"
    ? "fadeIn 1s"
    : el.animation === "zoom"
    ? "zoomIn 0.8s"
    : el.animation === "slide"
    ? "slideIn 0.8s"
    : "none"
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

{el.type === "image" && <img src={el.src} style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
{el.type === "video" && <video src={el.src} controls style={{ width: "100%", height: "100%" }} />}
{el.type === "audio" && <audio src={el.src} controls style={{ width: "100%" }} />}
  {/* TABLE */}
               {el.type === "table" && (
  <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
    <table style={{ borderCollapse: "collapse", width: "100%", height: "100%" }}>
      <tbody>
        {el.data.map((row, rIndex) => (
          <tr key={rIndex}>
            {row.map((cell, cIndex) => (
              <td
                key={cIndex}
                contentEditable
                suppressContentEditableWarning
                style={{
                  border: "1px solid #000",
                  padding: "5px",
                  textAlign: "center",
                  minWidth: "50px"
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

                {/* CHART */}
                {el.type === "chart" && (
                  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <strong>{el.title}</strong>
                    <div style={{ display: "flex", gap: "2px", marginTop: "5px" }}>
                      {el.chartType === "bar" && el.data.map((d, i) => <div key={i} style={{ width: "20px", height: `${d * 5}px`, background: "#2196F3" }} />)}
                      {el.chartType === "line" && <div>Line chart placeholder</div>}
                      {el.chartType === "pie" && <div>Pie chart placeholder</div>}
                    </div>
                  </div>
                )}
</Rnd>
))}
 {selectedElement !== null && activeSlide.elements[selectedElement]?.type === "table" && (
              <div style={{ position: "absolute", top: 0, left: "820px", background: "white", border: "1px solid gray", padding: "10px", display: "flex", flexDirection: "column", gap: "5px", zIndex: 1000 }}>
                <button onClick={() => addTableRow(selectedElement)}>Add Row</button>
                <button onClick={() => removeTableRow(selectedElement)}>Remove Row</button>
                <button onClick={() => addTableColumn(selectedElement)}>Add Column</button>
                <button onClick={() => removeTableColumn(selectedElement)}>Remove Column</button>
              </div>
            )}

            {/* CHART TOOLBAR */}
            {selectedElement !== null && activeSlide.elements[selectedElement]?.type === "chart" && (
              <div style={{ position: "absolute", top: 0, left: "820px", background: "white", border: "1px solid gray", padding: "10px", display: "flex", flexDirection: "column", gap: "5px", zIndex: 1000 }}>
                <button onClick={() => changeChartType(selectedElement, "bar")}>Bar Chart</button>
                <button onClick={() => changeChartType(selectedElement, "line")}>Line Chart</button>
                <button onClick={() => changeChartType(selectedElement, "pie")}>Pie Chart</button>
                <button onClick={() => addChartData(selectedElement)}>Add Data</button>
                <button onClick={() => removeChartData(selectedElement)}>Remove Data</button>
              </div>
            )}
            {/* Object Tools for Selected Element */}


    <button
      onClick={() => {
        // Bring to Front: move element to end of array
        const updatedSlides = slides.map(slide => {
          if (slide.id === currentSlide) {
            const newElements = [...slide.elements];
            const [elem] = newElements.splice(selectedElement, 1);
            newElements.push(elem);
            return { ...slide, elements: newElements };
          }
          return slide;
        });
        setSlides(updatedSlides);
      }}
    >
      Bring Forward
    </button>

    <button
      onClick={() => {
        // Send to Back: move element to start of array
        const updatedSlides = slides.map(slide => {
          if (slide.id === currentSlide) {
            const newElements = [...slide.elements];
            const [elem] = newElements.splice(selectedElement, 1);
            newElements.unshift(elem);
            return { ...slide, elements: newElements };
          }
          return slide;
        });
        setSlides(updatedSlides);
      }}
    >
      Send Backward
    </button>
  </div>
)}
          </div>
        </div>

      </div>
    </div>
  );
}


export default App;