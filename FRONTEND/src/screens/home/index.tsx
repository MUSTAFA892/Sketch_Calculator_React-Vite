import { ColorSwatch, Group } from '@mantine/core';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import { SWATCHES } from '@/constants';

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
    const [dictOfVars, setDictOfVars] = useState({});
    const [result, setResult] = useState<GeneratedResult>();
    const [latexPosition] = useState({ x: 10, y: 200 });
    const [latexExpression, setLatexExpression] = useState<Array<string>>([]);
    const [penSize, setPenSize] = useState(3);
    const [isEraser, setIsEraser] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (latexExpression.length > 0 && window.MathJax) {
            setTimeout(() => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        }
    }, [latexExpression]);

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
                ctx.fillStyle = darkMode ? '#3333' : '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [penSize, darkMode]);

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
                ctx.strokeStyle = isEraser ? 'white' : color;
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
        setIsDrawing(false);
    };

    const runRoute = async () => {
        const canvas = canvasRef.current;
        if (canvas) {
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
                }, 1000);
            });
        }
    };

    return (
        <>
            <style>
                {`
                .toolbar {
                    padding: 10px;
                    background: ${darkMode ? '#444' : '#f5f5f5'};
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    border-bottom: 2px solid ${darkMode ? '#222' : '#ddd'};
                    transition: background 0.3s ease;
                }

                .button, .reset-btn, .eraser-btn, .dark-mode-btn, .run-btn {
                    padding: 8px 16px;
                    background-color: ${darkMode ? '#555' : '#007bff'};
                    color: white;
                    border: none;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: background-color 0.3s ease;
                }

                .button:hover {
                    background-color: ${darkMode ? '#777' : '#0056b3'};
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
                    border: 2px solid ${darkMode ? '#555' : '#ccc'};
                    background-color: ${darkMode ? '#333' : '#fff'};
                    transition: background-color 0.3s ease;
                }
                `}
            </style>

            <div className={darkMode ? 'dark' : ''}>
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
                        <Button onClick={() => setDarkMode(!darkMode)} className="dark-mode-btn">
                            Toggle Dark Mode
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
