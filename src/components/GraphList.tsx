import Graph from './Graph';

import Equations from './interfaces/Equations';
import Cursor from './interfaces/Cursor';

const GraphList = ({ graphs } : { graphs: Equations[] } ) => {
    return (
        <>
        {
            graphs.map((graph: Equations) => {
                return graph.visible ? 
                    <Graph key={graph.id} sliderValues={graph.sliders.values} sliderVariables={graph.sliders.variables} inputContent={graph.equation} colour={graph.colour}/> 
                    : 
                    null
            }) 
        }
        </>

    )

}; 

export default GraphList;