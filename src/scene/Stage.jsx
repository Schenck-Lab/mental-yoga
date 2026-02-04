// scene/Scene.jsx

import { useAppContext } from '../context/AppContext';
import { LEVEL_SPEC } from './config';
import FoldableCube from './FoldableCube';


export function Stage() {
    const { sys } = useAppContext();

    const levelId = sys.level.value;
    const actors = LEVEL_SPEC[levelId] ?? [];

    return (
        <group name={`scene_level_${levelId}`}>
            {actors.map((cubeId, _) => {
                return (
                    <FoldableCube key={cubeId} cubeId={cubeId} />
                );
            })}
        </group>
    );
}
