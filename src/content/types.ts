export interface Highlight { x: number; y: number; w: number; h: number } // percentages 0-100
// `clip`: the step plays a silent screen recording (/clips/<id>.mp4) over its poster screenshot.
export interface Step { id: string; title: string; script: string; highlight?: Highlight; tip?: string; warning?: string; clip?: boolean }
// `intro`: short spoken opening for the module's HeyGen video (`/avatar/m<id>.mp4`).
export interface Module { id: string; title: string; icon: string; intro?: string; steps: Step[] }
