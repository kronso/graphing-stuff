import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'

import Grid from './components/Grid';
import AddBoardButton from './components/AddBoardButton';
import BoardList from './components/BoardList';
import GraphList from './components/GraphList';

import "./styles/reset.css";
import "./styles/index.css";

import Equations from './components/interfaces/Equations';

import Parser from './classes/parser';

function App() {
	// Initializes the first board and graph 	
	const [boards, setBoard] = useState<Equations[]>([
		{ 
			id: uuidv4(), equation: "", 
			colour: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}`, 
			visible: true, 
			sliders: { variables: [], values: [] } 
		}
	]);
	// Gets user input from InputEquation and updates the graph
	const getEquation = (eq: string, id: string): void => {
		const newBoards = [...boards];
        const board = newBoards.find(board => board.id === id);
		if (board === undefined) return;
		board.equation = eq;
		const y = new Parser(`(${eq})`, [], []);
		board.sliders.variables = y.getVariables();
		board.sliders.values.forEach((index) => {
			if (board.sliders.variables[index] === null) {
				board.sliders.values.pop();
			}
		});
		setBoard(newBoards);
	};
	// Gets inidividual slider values and updates the state
	const getSliderValues = (val: number, vari: string, id: string): void => {
		const newBoards = [...boards];
		const board = newBoards.find(board => board.id === id);
		if (board === undefined) return;
		board.sliders.variables.forEach((variable, index) => {
			if (variable === vari) {
				board.sliders.values[index] = val;
			}
		});
		setBoard(newBoards);
		// console.log(vari, val, id);
	}
	function addBoards(): void {
        setBoard((prevBoard: Equations[]) => {
            return [...prevBoard, 
			{ 
				id: uuidv4(), equation: "", 
				colour: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}`, 
				visible: true, sliders: { variables: [], values: [] } 
			}]
        });
	}
	function deleteBoard(id: string): void {
		const newBoards = [...boards];
		const board = newBoards.find((board, index) => {
			if (board === undefined) return
			if (board.id === id) newBoards.splice(index, 1);
			if (board === undefined) return
		});
		setBoard(newBoards);
	}
	function visibleBoard(id: string): void {	
		const newBoards = [...boards];
		const board = newBoards.find((board) => {
			if (board === undefined) return
			if (board.id === id) board.visible = !board.visible;
			if (board === undefined) return
		});
		setBoard(newBoards);
	}

	return (	
		<>	
			<div id="board-wrapper">
				<AddBoardButton onClick={addBoards}/>
				<BoardList boards={boards} getSliderValues={getSliderValues} visibleBoard={visibleBoard} getEquation={getEquation} deleteBoard={deleteBoard}/>
			</div>

			<div id="grid-wrapper">
				<Grid/>
				<GraphList graphs={boards}/>
			</div>
		</>
	);
}

export default App;
