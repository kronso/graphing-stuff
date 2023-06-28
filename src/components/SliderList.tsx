import Slider from './Slider';
import Equations from './interfaces/Equations';
const SliderList = ({boards, getSliderValues} : {
    boards: Equations, 
    getSliderValues: (val: number, vari: string, id: string) => void}) => {
    return (
        <>
        {   
            // Use the unique variable as the unique id
            boards.sliders.variables.map((variable: string) => {
                return <Slider key={variable} boards={boards} variable={variable} getSliderValues={getSliderValues}/>
            }) 
        }
        </>
    )
}

export default SliderList;
