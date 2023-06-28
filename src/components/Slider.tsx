import { useState, useRef } from 'react';

import Equations from './interfaces/Equations';
import { Console } from 'console';

const Slider = ({boards, variable, getSliderValues} : {
    boards: Equations, variable: string, 
    getSliderValues: (val: number, vari: string, id: string) => void}) => {

    const [value, setSlider] = useState<number | string>(0);
    const handleSliderValues = (e: React.ChangeEvent<HTMLInputElement>) => {
        getSliderValues(e.target.valueAsNumber, variable, boards.id)
        setSlider(e.target.valueAsNumber)
    }
    const handleSliderPosition = (e: React.ChangeEvent<HTMLInputElement>) => {
        getSliderValues((e.target.value as unknown)as number, variable, boards.id)
        setSlider(e.target.value);
    }
    // Updates the limits
    const [limits, setLimits] = useState<{min: string, max: string, step: string}>({min: "-20", max: "20", step: "0.1"});
    const handleSliderLimits = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Ensures the user cannot enter letters
        if (/[a-zA-Z]/g.test(e.target.value) || e.target.value == "") return;
        if (e.target.className == "slider-left") {
            setLimits({ min: e.target.value, max: limits.max, step: limits.step })
        } else if (e.target.className == "slider-right") {
            setLimits({ min: limits.min, max: e.target.value, step: limits.step })
        } else {
            setLimits({ min: limits.min, max: limits.max, step: e.target.value })
        }
    }
    
    const clearValue = (e: React.FocusEvent<HTMLInputElement>) => e.target.value = "";
    return (
        <div id="slider-wrapper">
            <label className="slider-label">{/-/g.test(variable) ? variable[1]: variable} = <input className="slider-position" placeholder={`position`} value={value} type="text" onChange={e => handleSliderPosition(e)} onFocus={e => clearValue(e)}/></label>
            <input className="slider-step" type="text" placeholder={`step`} value={limits.step} onChange={e => handleSliderLimits(e)} onFocus={e => clearValue(e)}/>
            <div id="slider-input-div">
                <input className="slider-left"  type="text"  placeholder={`min`} value={limits.min} onChange={e => handleSliderLimits(e)} onFocus={e => clearValue(e)}/>
                <input className="slider-input" type="range" min={limits.min}    max={limits.max}   step={limits.step} defaultValue="0"   onChange={e => handleSliderValues(e)}/>
                <input className="slider-right" type="text"  placeholder={`max`} value={limits.max} onChange={e => handleSliderLimits(e)} onFocus={e => clearValue(e)}/>
            </div>
        </div>
    )
}

export default Slider;