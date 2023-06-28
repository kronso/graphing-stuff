import InputEquation from './InputEquation';
import DeleteBoardButton from './DeleteBoardButton';
import VisibleBoardButton from './VisibleBoardButton';
import SliderList from './SliderList';

import Equations from './interfaces/Equations';

const Board = ({ boards, getSliderValues, visibleBoard, getEquation, deleteBoard } : 
	{ boards: Equations, 
		getSliderValues: (val: number, vari: string, id: string) => void,
		visibleBoard: (id: string) => void, 
		getEquation: (eq: string, id: string) => void, 
		deleteBoard: (id: string) => void }) =>{
			
    return (
		<div id="board">
			<div id="button-wrapper">
				<div id="delete-button-wrapper">
					<DeleteBoardButton boards={boards} deleteBoard={deleteBoard}/>
				</div>
				<InputEquation boards={boards} getEquation={getEquation}/>
				<div id="visible-button-wrapper">
					<VisibleBoardButton boards={boards} visibleBoard={visibleBoard}/>
				</div>
			</div>
			<SliderList boards={boards} getSliderValues={getSliderValues}/>
		</div>
    )
}

export default Board;