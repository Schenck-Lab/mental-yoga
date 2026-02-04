import { useRef, useEffect } from 'react';
import { FACE_LOCAL_FRAME_MAP, FACE_BITS } from '../../cubenet/cubeSpec';
import { HALF_UNIT } from '../../cubenet/cubeThreeModel';
import { useAppContext } from '../../context/AppContext';
import { OGRE_MAT } from '../MatList';

const h = HALF_UNIT;
const b = h * 0.75;
const posY = 0.025;

const vertexSkinPos = {
    xp: [+b, posY, -b],
    xn: [-b, posY, +b],
    zp: [+b, posY, +b],
    zn: [-b, posY, -b],
};

function VertexSkin({ cubeId, label, ax0, ax1 }) {
    const meshRef = useRef();
    const { cubeControllerMap } = useAppContext();
    const controller = cubeControllerMap[cubeId];
   
    const f0 = FACE_LOCAL_FRAME_MAP[label][ax0];
    const f1 = FACE_LOCAL_FRAME_MAP[label][ax1];

    const id = label + f0 + f1;
    const bitmap = FACE_BITS[label] 
                 | FACE_BITS[f0] 
                 | FACE_BITS[f1];

    useEffect(() => {
        controller.interactor.vertices[id] = meshRef;
        // eslint-disable-next-line
    }, []);

    return (
        <mesh
            ref={meshRef} 
            userData={{ id, bitmap }}
            position={vertexSkinPos[ax0]}
            onPointerOver={(e) => {
                e.stopPropagation();
                controller.interactor.hoveredVid = id;
                controller.interactor.handleVertexHover(id, 1);
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                controller.interactor.hoveredVid = null;
                controller.interactor.handleVertexHover(id, 0, label);
            }}
            onClick={(e) => {
                e.stopPropagation();
                controller.interactor.handleVertexClick(id, label);
                console.log(`Vertex clicked: ${id}`);
            }}
        >
            <cylinderGeometry args={[0.04,0.04,0.08]} />
            {OGRE_MAT.bodyV.tag}
        </mesh>
    );
}

export default VertexSkin;
