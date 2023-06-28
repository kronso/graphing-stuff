import Equations from './interfaces/Equations';

const DeleteBoardButton = ({boards, deleteBoard} : {boards: Equations, deleteBoard: (id: string) => void}) => {
	// Sends true to decrement number of boards
    const handleDeleteBoard = () => deleteBoard(boards.id)
    return (
        <button className="delete-board-button" onClick={handleDeleteBoard}></button>
    )
}
export default DeleteBoardButton;