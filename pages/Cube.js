import React, {useState} from "react"
import { Canvas } from '@react-three/fiber'
import Box from './components/Box'

const displayBoxes = (num) => {
    let boxes = []
    for (let i=0; i<num; i++) {
        boxes.push( <Box position={[-1.2, i*2, i*2]} key={i}/>)
    }
    return boxes
}

function Home() {

  const [numBoxes, setNumBoxes] = useState(20);

  return (
    <Canvas>
     <ambientLight />
     <pointLight position={[10, 10, 10]} />
     {displayBoxes(20)}
   </Canvas>
  )
}

export default Home

// createRoot(document.getElementById('root')).render(
//   <Canvas>
//     <ambientLight />
//     <pointLight position={[10, 10, 10]} />
//     <Box position={[-1.2, 0, 0]} />
//     <Box position={[1.2, 0, 0]} />
//   </Canvas>,
// )