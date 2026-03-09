import { memo, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { FACE_LABEL } from '../cubenet/cubeSpec';
import { HALF_UNIT } from '../cubenet/cubeThreeModel';
import { useFrame } from '@react-three/fiber';
import { _render_shout_ } from '../utils/utils';
import Face from './Face';


function FoldableCube({ cubeId }) {
    _render_shout_('FoldableCube', `${cubeId}`);

    const { cubeControllerMap } = useAppContext();
    const rootRef = useRef(null);

    const controller = cubeControllerMap[cubeId];

    useEffect(() => {
        if (!controller) return;
        controller.root = rootRef;
    }, []);

    useFrame((_, delta) => {
        if (!controller) return;
        controller.updateAnimation(delta);
    });

    return (
        <group ref={rootRef} position={[0, HALF_UNIT, 0]}>
            {Object.keys(FACE_LABEL).map((label) => (
                <Face key={label} cubeId={cubeId} label={label} />
            ))}
        </group>
    );
}

export default memo(FoldableCube);