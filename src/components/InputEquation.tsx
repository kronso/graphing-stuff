import React from 'react'
import Equations from './interfaces/Equations';

const InputEquation = ({boards, getEquation} : {
	boards: Equations, 
	getEquation: (eq: string, id: string) => void}) => {

	// Sends equation to parent
	const handleGetEquation = (e: React.ChangeEvent<HTMLInputElement>): void => {
		getEquation(e.target.value, boards.id);
	};

    return (
	<>
        <input onChange={(e) => {handleGetEquation(e);}} type="text" placeholder="enter equation..." id="input-equation"/>
	</>
    )
}

export default InputEquation;