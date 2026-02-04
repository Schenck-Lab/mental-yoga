import { useRef, useEffect } from 'react';
import { FACE_LABEL } from '../cubenet/cubeSpec';
import { HALF_UNIT } from '../cubenet/cubeThreeModel';
import { useAppContext } from '../context/AppContext';
import Face from './Face';
import { useFrame } from '@react-three/fiber';
import { _render_shout_ } from '../utils/utils';

export default function FoldableCube({ cubeId }) {
    _render_shout_('FoldableCube', `${cubeId}`);

    const { cubeControllerMap, orbitControlsRef, weakResetSignal } = useAppContext();

    const rootRef = useRef(null);
    const controller = cubeControllerMap[cubeId];

    useEffect(() => {
        _render_shout_('FoldableCube', `${cubeId} --Mount`);
        // FIXED ME:
        controller.root = rootRef;
        controller.init = false;
    // eslint-disable-next-line
    }, []);

    
    useFrame((_, delta) => {
        controller.updateAnimation(delta);

        // TODO: manually reset
        if (weakResetSignal.current > 0) {
            orbitControlsRef.current?.resetWithAnimation?.();
            //orbitControlsRef.current?.resetInstant?.();
            controller.rotateToPose('TF');
            controller.resetToCubeLocked();
            weakResetSignal.current = 0;
        }
    });
    
    return (
        <group ref={rootRef} position={[0,HALF_UNIT,0]}>
            {Object.keys(FACE_LABEL).map((label) => (
                <Face key={label} cubeId={cubeId} label={label} />
            ))}
        </group>
    );
}
