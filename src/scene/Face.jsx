import { useRef, useEffect } from 'react';
import { FACE_BITS } from '../cubenet/cubeSpec.js';
import { HALF_UNIT, INIT_POS, INIT_ROT } from '../cubenet/cubeThreeModel.js';
import { SKIN_MAP } from './cubeCharacters.js';
import { useAppContext } from '../context/AppContext.jsx';


export default function Face({ cubeId, label }) {
    const { cubeControllerMap } = useAppContext();
    const controller = cubeControllerMap[cubeId];
    
    const face = useRef();
    const xp = useRef();
    const xn = useRef();
    const zp = useRef();
    const zn = useRef();
    const bitmap = FACE_BITS[label];

    // Attach R3F object refs to cube controller
    useEffect(() => {
        controller.attachFaceRig(label, { face, xp, xn, zp, zn });
        // eslint-disable-next-line
    }, []);

    const Skin = SKIN_MAP[cubeId];
    return (
        <group ref={face} userData={{ label, bitmap }} 
            position={INIT_POS[label]}
            rotation={INIT_ROT[label]}
        >
            {/* Four Hinges */}
            <group ref={xp} position={[+HALF_UNIT, 0, 0]} />
            <group ref={xn} position={[-HALF_UNIT, 0, 0]} />
            <group ref={zp} position={[0, 0, +HALF_UNIT]} />
            <group ref={zn} position={[0, 0, -HALF_UNIT]} />

            {/* Face Skin */}
            <Skin cubeId={cubeId} label={label} />
        </group>
    );
}
