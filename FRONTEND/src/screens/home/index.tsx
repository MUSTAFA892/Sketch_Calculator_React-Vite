import { ColorSwatch, Group } from '@mantine/core';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import { SWATCHES } from '@/constants';
import { useNavigate } from 'react-router-dom';

interface GeneratedResult {
  expression: string;
  answer: string;
}

interface Response {
  expr: string;
  result: string;
  assign: boolean;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('rgb(255, 255, 255)');
  const [reset, setReset] = useState(false);
  const navigate = useNavigate();
  const [dictOfVars, setDictOfVars] = useState({});
  const [result, setResult] = useState<GeneratedResult>();
  const [latexPosition] = useState({ x: 10, y: 200 });
  const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
  const [penSize, setPenSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [canvasImage, setCanvasImage] = useState<string | null>(null); // To store the canvas image before size change



  useEffect(() => {
    if (result) {
      renderLatexToCanvas(result.expression, result.answer);
    }
  }, [result]);

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setLatexExpression([]);
      setResult(undefined);
      setDictOfVars({});
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        ctx.lineCap = 'round';
        ctx.lineWidth = penSize;
        ctx.fillStyle = '#fff'; // Set canvas background to white (light theme)
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // If there is a saved image, restore the drawing on the canvas
        if (canvasImage) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
          img.src = canvasImage;
        }
      }
    }
  }, [penSize, canvasImage]);

  const renderLatexToCanvas = (expression: string, answer: string) => {
    const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
    setLatexExpression([...latexExpression, latex]);
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = isEraser ? '#fff' : color; // Eraser color in light theme
        ctx.lineWidth = penSize;
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Save the current drawing to the canvasImage state before stopping
        setCanvasImage(canvas.toDataURL());
      }
    }
    setIsDrawing(false);
  };

  const runRoute = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        const response = await axios({
          method: 'post',
          url: `${import.meta.env.VITE_API_URL}/calculate`,
          data: {
            image: canvas.toDataURL('image/png'),
            dict_of_vars: dictOfVars,
          },
        });

        const resp = await response.data;
        resp.data.forEach((data: Response) => {
          if (data.assign) {
            setDictOfVars({ ...dictOfVars, [data.expr]: data.result });
          }
        });

        resp.data.forEach((data: Response) => {
          setTimeout(() => {
            setResult({ expression: data.expr, answer: data.result });

            // After receiving the result, navigate to the result page and pass the result
            navigate('/result', { state: { result: { expression: data.expr, answer: data.result } } });
          }, 1000);
        });
      } catch (error) {
        console.error('Error while fetching result:', error);
      }
    }
  };

  return (
    <>
<style>
  {`
    body, html {
      overflow: hidden;
      height: 100%;
      margin: 0;
    }

    .toolbar {
      padding: 8px 10px; /* Reduced padding for smaller navbar */
      background: #f5f5f5; /* Light theme background */
      display: flex;
      gap: 10px;
      align-items: center;
      border-bottom: 2px solid #ddd;
      transition: background 0.3s ease;
    }

    .button, .reset-btn, .eraser-btn, .run-btn {
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

    .button:hover {
      background-color: #0056b3;
    }

    .pen-size {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .pen-size-slider {
      cursor: pointer;
    }

    .latex-content {
      animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .canvas {
      border: 2px solid #ccc;
      background-color: #fff; /* Canvas background to white */
      transition: background-color 0.3s ease;
    }

    /* Mobile View Adjustments (only for screens <= 768px) */
    @media (max-width: 768px) {
      /* Stack toolbar items vertically */
      .toolbar {
        flex-direction: column; /* Stack items in a column for mobile */
        padding: 8px 10px; /* Reduced padding for smaller navbar */
      }

      /* Make the buttons full width and increase their size */
      .button, .reset-btn, .eraser-btn, .run-btn {
        width: 100%;
        padding: 12px 20px;
        margin: 5px 0;
      }

      /* Adjust the pen-size control layout for mobile */
      .pen-size {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      /* Make the slider fit the screen */
      .pen-size-slider {
        width: 100%;
      }

      /* Ensure the canvas takes enough space without getting hidden by navbar */
      .canvas {
        height: calc(100vh - 140px); /* Adjust canvas height considering the navbar */
      }

      /* Ensure latex content fits on smaller screens */
      .latex-container {
        width: 100%;
        padding: 10px;
      }
    }

    /* Extra adjustments for very small screens (e.g., small phones) */
    @media (max-width: 480px) {
      .button, .reset-btn, .eraser-btn, .run-btn {
        font-size: 14px; /* Smaller text for buttons */
      }

      .pen-size-slider {
        height: 10px; /* Adjust slider height for smaller devices */
      }
    }
  `}
</style>


      <div>
        <div className="toolbar">
          <Button onClick={() => setReset(true)} className="reset-btn">
            Reset
          </Button>
          <Group>
            {SWATCHES.map((swatch) => (
              <ColorSwatch
                key={swatch}
                color={swatch}
                onClick={() => {
                  setColor(swatch);
                  setIsEraser(false);
                }}
                className="color-swatch"
              />
            ))}
            <Button onClick={() => setIsEraser(true)} className="eraser-btn">
              Eraser
            </Button>
          </Group>
          <div className="pen-size">
            <input
              type="range"
              min="1"
              max="20"
              value={penSize}
              onChange={(e) => setPenSize(Number(e.target.value))}
              className="pen-size-slider"
            />
            <span className="pen-size-label">{penSize}px</span>
          </div>
          <Button onClick={runRoute} className="run-btn">
            Run
          </Button>
          <Button onClick={() => navigate('/result')} className="run-btn">
            Result
          </Button>
        </div>
        <canvas
          ref={canvasRef}
          className="canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
        <div className="latex-container">
          {latexExpression.map((latex, index) => (
            <Draggable key={index} defaultPosition={latexPosition}>
              <div className="latex-content">
                <div dangerouslySetInnerHTML={{ __html: latex }} />
              </div>
            </Draggable>
          ))}
        </div>
      </div>
    </>
  );
}
