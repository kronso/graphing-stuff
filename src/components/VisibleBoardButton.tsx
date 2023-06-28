import Equations from './interfaces/Equations';

const VisibleBoardButton = ({boards, visibleBoard} : {boards: Equations, visibleBoard: (id: string) => void}) => {

    const handleVisibility = () => visibleBoard(boards.id);

    return (
        boards.visible ? 
        <button className="visible-board-button" onClick={handleVisibility}></button>
        :
        <button className="invisible-board-button" onClick={handleVisibility}></button>
    )
}

export default VisibleBoardButton;