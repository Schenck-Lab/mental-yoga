// scene/Scene.jsx

import { CUBE_ID } from './cubeCharacters';
import FoldableCube from './FoldableCube';
import { _render_shout_ } from '../utils/utils';


export default function Stage() {
    _render_shout_('Stage');

    return (
        <group>
            <FoldableCube cubeId={CUBE_ID.COOKIE} />
            <FoldableCube cubeId={CUBE_ID.CEEKIO} />
            <FoldableCube cubeId={CUBE_ID.CHICKEN} />
            <FoldableCube cubeId={CUBE_ID.PIPE} />
            <FoldableCube cubeId={CUBE_ID.OGRE} />
            <FoldableCube cubeId={CUBE_ID.ICEBOX} />
            <FoldableCube cubeId={CUBE_ID.ICEBOX_STATIC} />
            <FoldableCube cubeId={CUBE_ID.EVILEYE} />
            <FoldableCube cubeId={CUBE_ID.EVILEYE_STATIC} />
        </group>
    );
}
