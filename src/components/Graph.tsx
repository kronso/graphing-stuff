import { useRef, useEffect, useState } from 'react'
import Parser from '../classes/parser';
import Cursor from './interfaces/Cursor';

// interface Cursor {
//     position: {
//         x : number
//         y : number
//     }
//     moving: boolean
//     moved: boolean
// }

const Graph = ({ sliderValues, sliderVariables, inputContent, colour }: { sliderVariables: string[], sliderValues: number[], inputContent: string, colour: string }) => {
    const step = 40;
    let y: Parser;

    function drawGraph(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        const n_col = Math.ceil(canvas.width / step) + 0.5;
        const n_row = Math.ceil(canvas.height / step) + 0.5;
        const X_CENTER = Math.floor(n_col / 2) * step + 0.5;
        const Y_CENTER = Math.floor(n_row / 2) * step + 0.5;
        const LIMIT = 20;
        const PRECISION = .05;
        context.lineWidth = 2;
        context.lineCap = "round"
        // Graph
        // Positive x-axis
        // context.beginPath();
        // for (let x = -LIMIT; x <= LIMIT; x+=PRECISION) {    
        //     y = new Parser(`(${inputContent})`, [...sliderValues, x], [...sliderVariables]);
        //     y.infixToPostfix();
        //     // y = x, if var in eq is x
        //     if (/x+?/gi.test(`(${inputContent})`)) {
        //         context.lineTo((x * step) + X_CENTER, -(y.calculate() * step) + Y_CENTER);
        //     // x = y, if var in eq is y
        //     } else if (/y+?/gi.test(`(${inputContent})`)) {
        //         context.lineTo((y.calculate() * step) + X_CENTER, -(x * step) + Y_CENTER);
        //     } else {
                
        //     }
        // }
        // context.strokeStyle = colour;    
        // context.stroke();       
        // // Negative x-axis
        context.clearRect(0, 0, canvas.width, canvas.height)
        // context.clearRect(0, 0, 0, 0);
        context.beginPath();
        for (let x = LIMIT; x >= -LIMIT; x-=PRECISION) {
            y = new Parser(`(${inputContent})`, [...sliderValues, x], [...sliderVariables]);
            y.infixToPostfix();
            if (/x+?/gi.test(`(${inputContent})`)) {
                context.lineTo((x * step) + X_CENTER, -(y.calculate() * step) + Y_CENTER);
            } else if (/y+?/gi.test(`(${inputContent})`)) {
                context.lineTo((y.calculate()  * step) + X_CENTER, -(x * step) + Y_CENTER);
            }
        }
        context.strokeStyle = colour;    
        context.stroke();  
    }
    function drawPlots(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        const n_col = Math.ceil(canvas.width / step) + 0.5;
        const n_row = Math.ceil(canvas.height / step) + 0.5;
        const X_CENTER = Math.floor(n_col / 2) * step + 0.5;
        const Y_CENTER = Math.floor(n_row / 2) * step + 0.5;
        context.beginPath();
        for (let x = -20; x <= 20; x+=1) {
            y = new Parser(`(${inputContent})`, [...sliderValues, x], [...sliderVariables]);
            y.infixToPostfix();
            if (x.toFixed(0) == "0") {
                if (/x+?/gi.test(`(${inputContent})`)) {
                    context.moveTo((x * step) + X_CENTER, -(y.calculate() * step) + Y_CENTER);
                    context.arc((x * step) + X_CENTER, -(y.calculate() * step) + Y_CENTER, 3, 0, 2 * Math.PI);
                    // console.log((x * step) + X_CENTER, -(y.calculate() * step) + Y_CENTER);
                } else if (/y+?/gi.test(`(${inputContent})`)) {
                    context.moveTo((y.calculate() * step) + X_CENTER, -(x * step) + Y_CENTER);
                    context.arc((y.calculate() * step) + X_CENTER, -(x * step) + Y_CENTER, 3, 0, 2 * Math.PI);
                    // console.log((y.calculate() * step) + X_CENTER, -(x * step) + Y_CENTER);
                }
            }
            if (y.calculate() == 0) {
                if (/x+?/gi.test(`(${inputContent})`)) {
                    context.moveTo((x * step) + X_CENTER, -(y.calculate() * step) + Y_CENTER);
                    context.arc((x * step) + X_CENTER, -(y.calculate() * step) + Y_CENTER, 3, 0, 2 * Math.PI);
                    // console.log((x * step) + X_CENTER, -(y.calculate() * step) + Y_CENTER);
                } else if (/y+?/gi.test(`(${inputContent})`)) {
                    context.moveTo((y.calculate() * step) + X_CENTER, -(x * step) + Y_CENTER);
                    context.arc((y.calculate() * step) + X_CENTER, -(x * step) + Y_CENTER, 3, 0, 2 * Math.PI);
                    // console.log((y.calculate() * step) + X_CENTER, -(x * step) + Y_CENTER);
                }
            }
        }
        context.fillStyle = "#6298cd";
        context.fill();
        context.strokeStyle = "#6298cd";    
        context.stroke(); 

        context.beginPath();
        for (let x = 20; x >= -20; x-=1) {
            y = new Parser(`(${inputContent})`, [...sliderValues, x], [...sliderVariables]);
            y.infixToPostfix(); 
            if (y.calculate() == 0) {
                if (/x+?/gi.test(`(${inputContent})`)) {
                    context.moveTo((x * step) + X_CENTER, -(y.calculate() * step) + Y_CENTER);
                    context.arc((x * step) + X_CENTER, -(y.calculate() * step) + Y_CENTER, 3, 0, 2 * Math.PI);
                    // console.log((x * step) + X_CENTER, -(y.calculate() * step) + Y_CENTER);
                } else if (/y+?/gi.test(`(${inputContent})`)) {
                    context.moveTo((y.calculate() * step) + X_CENTER, -(x * step) + Y_CENTER);
                    context.arc((y.calculate() * step) + X_CENTER, -(x * step) + Y_CENTER, 3, 0, 2 * Math.PI);
                    // console.log((y.calculate() * step) + X_CENTER, -(x * step) + Y_CENTER);
                }
            }
        }
        context.fillStyle = "#6298cd";
        context.fill();
        context.strokeStyle = "#6298cd";    
        context.stroke(); 
    }
    const canvas_ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvas_ref.current as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        canvas.style.width ='100%';
        canvas.style.height='100%';
        // Stops setting the w and h to the original offset after the user has 
        // ... moved the cursor. This stops the cursor from going back to the origin
        if (start.moved == false) {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        drawGraph(canvas, context);     
        drawPlots(canvas, context);
    }, [[...sliderValues], [...sliderVariables], inputContent])




    // Mouse event handling:
    const [start, setStart] = useState<{ position: Cursor, moving: boolean, moved: boolean }>({ position: {x:0,y:0}, moving: false, moved: false });
    const getPos = (e: React.MouseEvent<HTMLCanvasElement>): { x: number, y: number } => {
        const canvas = canvas_ref.current as HTMLCanvasElement;
        return {
            x: e.clientX - canvas.offsetLeft,
            y: e.clientY - canvas.offsetTop 
        }
    }

    const startMovingGraph = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => setStart({ position: getPos(e), moving: true, moved: true });

    const stopMovingGraph = () => setStart({ position: { x: start.position.x, y: start.position.y }, moving: false, moved: true });

    const moveGraph = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvas_ref.current as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        // Only move the grid when we registered a mousedown event
        if (start.moving === false) return;
        const pos = getPos(e);
        // Move coordinate system in the same way as the cursor
        context.translate(pos.x - start.position.x, pos.y - start.position.y);
        drawGraph(canvas, context);
        setStart({ position: pos, moving: true, moved: true  });
    }   

    const zoomGraph = (e: React.WheelEvent<HTMLCanvasElement>) => {
        const canvas = canvas_ref.current as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        let scale = 1;
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(0.125, scale), 4)
        context.scale(scale, scale);
        drawGraph(canvas, context);
        
    }

    return (
        <canvas ref={canvas_ref} className="canvas-grid" onWheel={(e) => zoomGraph(e)} onMouseMove={(e) => moveGraph(e)} onMouseDown={(e) => startMovingGraph(e)} onMouseUp={stopMovingGraph}></canvas>
    )
}

export default Graph;
