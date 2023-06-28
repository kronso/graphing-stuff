export default interface Equations {
	id: string;
	equation: string
	colour: string
	visible: boolean
	sliders: Sliders
}

interface Sliders {
	variables: string[]
	values: number[]
}