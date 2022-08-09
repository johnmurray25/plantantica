import React from 'react'

const Cube = () => {
  return (
    <div></div>
  )
}

export default Cube

// import { createRoot } from 'react-dom/client'
// import React, { useRef, useState } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'

// interface Mesh {
//     rotation;
// }

// function Box(props) {
//     // This reference will give us direct access to the mesh
//     const mesh: React.MutableRefObject<Mesh> = useRef()
//     // Set up state for the hovered and active state
//     const [hovered, setHover] = useState(false)
//     const [active, setActive] = useState(false)
//     // Subscribe this component to the render-loop, rotate the mesh every frame
//     useFrame((state, delta) => mesh.current && mesh.current.rotation ? (mesh.current.rotation.x += 0.01) : {})

//     return (
//         <mesh
//             {...props}
//             ref={mesh}
//             scale={active ? 1.5 : 1}
//             onClick={(event) => setActive(!active)}
//             onPointerOver={(event) => setHover(true)}
//             onPointerOut={(event) => setHover(false)}>
//             <boxGeometry args={[1, 1, 1]} />
//             <meshStandardMaterial color={hovered ? 'hotpink' : 'lightgreen'} />
//         </mesh>
//     )
// }

// export default Box 