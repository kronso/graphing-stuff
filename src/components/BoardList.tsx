import Board from './Board';

import Equations from './interfaces/Equations';

const BoardList = ({ boards, getSliderValues, visibleBoard, getEquation, deleteBoard } : 
    { boards: Equations[], 
        getSliderValues: (val: number, vari: string, id: string) => void,
        visibleBoard: (id: string) => void, 
        getEquation: (eq: string, id: string) => void, 
        deleteBoard: (id: string) => void }) => { 

    return (
        <> 
        {
            boards.map((board: Equations) => {
                return <Board key={board.id} boards={board} getSliderValues={getSliderValues} visibleBoard={visibleBoard} getEquation={getEquation} deleteBoard={deleteBoard}/>
            })
        } 
        </>
    )
}

export default BoardList;