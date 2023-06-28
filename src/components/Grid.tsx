import { useRef, useState, useEffect } from 'react'

import Cursor from './interfaces/Cursor';

const Grid = () => {
    function drawGrid(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        context.lineWidth = 0.2;
        const step = 40;
        const left = 0.5 - Math.ceil(canvas.width / step) * step * 10;
        const top = 0.5 - Math.ceil(canvas.height / step) * step * 10;
        const right = 10 * canvas.width;
        const bottom = 10 * canvas.height;

        const n_col = Math.ceil(canvas.width / step) + 0.5;
        const n_row = Math.ceil(canvas.height / step) + 0.5;
        const X_CENTER = Math.floor(n_col / 2) * step + 0.5;
        const Y_CENTER = Math.floor(n_row / 2) * step + 0.5;

        context.clearRect(left, top, right - left, bottom - top);
        for (let x = left; x <= right; x += step) {
            // Draws the rows
            context.beginPath();
            context.moveTo(x, top);
            context.lineTo(x, bottom);
            // Draws the number-line
            context.fillStyle = "#eeeeee";
            context.fillText(`${Math.ceil((x - 40) / 40)}`, x + X_CENTER - 4, Y_CENTER + 10, 50);
            // Draws the center x-axis
            if (x == Math.floor(n_col / 2) * step + 0.5) { 
                context.strokeStyle = "#eeeeee";
                context.stroke(); 
            }
            context.strokeStyle = "#303030";
            context.stroke(); 
        }
        for (let y = top; y <= bottom; y += step) {
            // Draws the columns
            context.beginPath();
            context.moveTo(left, y);
            context.lineTo(right, y);
            // Draws the number-line
            context.fillStyle = "#eeeeee";
            context.fillText(`${Math.ceil((y - 40) / 40)}`, X_CENTER + 4, -(y) + Y_CENTER + 3, 50);
            // Draws the center y-axis
            if (y == Math.floor(n_row / 2) * step + 0.5) {
                context.strokeStyle = "#eeeeee";
                context.stroke(); 
            }
            context.strokeStyle = "#303030";
            context.stroke(); 
        }   
    }
    const canvas_ref = useRef<HTMLCanvasElement>(null);
    // useEffect hook allows us to draw the canvas and update its state
    useEffect(() => {
        const canvas = canvas_ref.current as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        // Make it visually fill the positioned parent
        canvas.style.width ='100%';
        canvas.style.height='100%';
        // ...then set the internal size to match
        if (start.moved === false) {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;    
        }    
        drawGrid(canvas, context);
    }, [])

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
        drawGrid(canvas, context);
        setStart({ position: pos, moving: true, moved: true  });
    }   
    const zoomGraph = (e: React.WheelEvent<HTMLCanvasElement>) => {
        const canvas = canvas_ref.current as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        let scale = 1;
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(0.125, scale), 4)
        context.scale(scale, scale);
        drawGrid(canvas, context);
    }

    return (
        <canvas ref={canvas_ref} className="canvas-grid" onWheel={(e) => zoomGraph(e)} onMouseMove={(e) => moveGraph(e)} onMouseDown={(e) => startMovingGraph(e)} onMouseUp={stopMovingGraph}></canvas>
    )

}; 

export default Grid;