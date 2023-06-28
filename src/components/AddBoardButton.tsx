const AddBoardButton = ({onClick} : {onClick: (clicked: boolean) => void}) => {

    const isClicked = () => onClick(true);

    return (
        <button id="add-board-button" onClick={isClicked}>+</button>
    )
}

export default AddBoardButton;