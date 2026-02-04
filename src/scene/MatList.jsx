import * as THREE from 'three';


export const HOVER_MAT = stdNewMat('hsl(46, 70%, 60%)', 3);
export const SELECT_MAT = stdNewMat('hsl(28, 69.60%, 60.00%)', 3);

export const FACE_MRK_MAT = null;
export const FACE_HOV_MAT = stdNewMat('hsl(46, 70%, 60%)', 3);
export const FACE_SEL_MAT = createStdMat('hsl(42, 68%, 69%)', 0, null, true).new;
export const FACE_CACHE = stdNewMat('hsl(145, 11.10%, 78.80%)', 0, null, true);

function createStdMat(hsl, ev=0, ec=null, flat=false, mv=0.5, rv=0.5) {
    return {
        tag: <meshStandardMaterial
                color={hsl}
                metalness={mv}
                roughness={rv}
                side={THREE.DoubleSide}
                flatShading={flat}
                emissive={(ev > 0) ? (ec || hsl) : null}
                emissiveIntensity={ev}
            />,
        new: new THREE.MeshStandardMaterial({
                color: hsl,
                metalness: mv,
                roughness: rv,
                side: THREE.DoubleSide,
                flatShading: flat,
                emissive: (ev > 0) ? (ec || hsl) : null,
                emissiveIntensity: ev,
            })
    };
}


function createBasicMat(hsl) {
    return {
        tag: <meshBasicMaterial
                color={hsl}
                side={THREE.DoubleSide}
            />,
        new: new THREE.MeshBasicMaterial({
                color: hsl,
                side: THREE.DoubleSide,
            })
    };
}


export function stdMat(hsl, ev=0, ec=null, flat=false) {
    return (
        <meshStandardMaterial
            color={hsl}
            metalness={0.3}
            roughness={0.9}
            side={THREE.DoubleSide}
            flatShading={flat}
            emissive={ev > 0 ? ec || hsl : null}
            emissiveIntensity={ev}
        />
    );
}

function stdNewMat(hsl, ev=0, ec=null, flat=false) {
    return new THREE.MeshStandardMaterial({
        color: hsl,
        metalness: 0.3,
        roughness: 0.8,
        side: THREE.DoubleSide,
        flatShading: flat,
        emissive: ev > 0 ? (ec || hsl) : null,
        emissiveIntensity: ev,
    });
}


export const SIMPLE_MAT = {
    label: stdMat('hsl(0, 0%, 100%)', 1),

};

export const V_MAT = {
    label: stdMat('hsl(271, 9%, 47%)', 1),

};

export const COOKIE_MAT = {
    dough: createStdMat('hsl(40, 49.80%, 55.50%)', 0, null, true, 0.4, 0.9),
    choc: createStdMat('hsl(33, 36%, 16%)', 0, null, true, 0.4, 0.9),
    text: createStdMat('hsl(33, 37.90%, 65.90%)', 1, null),
};


const mv_3 = 0.6;
const rv_3 = 0.9;
export const POP_MAT = {
    green: createStdMat('hsl(188, 54%, 72%)', 0, null, false, mv_3, rv_3),
    red: createStdMat('hsl(350, 49%, 52%)', 0, null, false, mv_3, rv_3),
    blue: createStdMat('hsl(214, 62%, 57%)', 0, null, false, mv_3, rv_3),
    yellow: createStdMat('hsl(30, 96%, 64%)', 0, null, false, mv_3, rv_3),
    pink: createStdMat('hsl(289, 98%, 81%)', 0, null, false, mv_3, rv_3),
    mortar: createStdMat('hsl(30, 10%, 48%)', 0, null, false, 0.2, 1.0),
    pipe: createStdMat('hsl(165, 28%, 45%)', 0, null, false, 0.9, 0.7),
    pipeT: createStdMat('hsl(165, 28%, 45%)', 0, null, true, 0.9, 0.7),
    brick: createStdMat('hsl(9, 36%, 30%)', 0, null, true, 0.1, 1),
    text: createStdMat('hsl(17, 17%, 92%)', 0.3, null, false, 0.3, 0.8),
    cover: createStdMat('hsla(0, 0%, 50%, 1.00)', 0, null, true, 0.5, 0.5),
    coverDark: createStdMat('hsl(0, 0%, 20%)', 0, null, true, 0.3, 0.9),
};


const mv = 0.9;
const rv = 0.9;
export const OGRE_MAT = {
    eye: createStdMat('hsl(41, 48%, 70%)', 1, null, false, mv, rv),
    body: createStdMat('hsl(218, 38%, 50%)', 0, null, true, mv, rv),
    bodyS: createStdMat('hsl(218, 38%, 50%)', 0, null, false, mv, rv),
    bodyV: createStdMat('hsl(218, 38%, 50%)', 0.5, null, true, mv, rv),
    hair: createStdMat('hsl(0, 0%, 0%)', 0, null, true, mv, rv),
    tusk: createStdMat('hsl(37, 37%, 86%)', 0, null, true, mv, rv),
    belt: createStdMat('hsl(13, 46%, 39%)', 0, null, true, mv, rv),
    cloth0: createStdMat('hsl(255, 16%, 41%)', 0, null, true, mv, rv),
    cloth1: createStdMat('hsl(255, 28%, 32%)', 0, null, true, mv, rv),
    trunk: createStdMat('hsl(27, 6%, 30%)', 0, null, true, mv, rv),
    leaf: createStdMat('hsl(203, 14%, 32%)', 0, null, true, mv, rv),
};

const mv_5 = 0.3;
const rv_5 = 0.9;
const smooth = true;
export const ICEBOX_MAT = {
    waff: createStdMat('hsl(36, 42%, 52%)', 0, null, true, mv_5, rv_5),
    blue: createStdMat('hsl(267, 36%, 32%)', 0, null, smooth, mv_5, rv_5),
    staw: createStdMat('hsl(315, 42%, 56%)', 0, null, smooth, mv_5, rv_5),
    moon: createStdMat('hsl(205, 65%, 41%)', 0, null, smooth, mv_5, rv_5),
    choc: createStdMat('hsl(36, 36%, 17%)', 0, null, smooth, mv_5, rv_5),
    plain: createStdMat('hsl(34, 13%, 89%)', 0, null, smooth, mv_5, rv_5),
    mint: createStdMat('hsl(172, 45%, 42%)', 0, null, smooth, mv_5, rv_5),

    hover: createStdMat('hsl(53, 59%, 71%)', 1, null, true, mv_5, rv_5),
    red: createStdMat('hsl(0, 100.00%, 50.00%)', 0, null, true, mv_5, rv_5),
    green: createStdMat('hsl(167, 10.90%, 58.60%)', 0, null, true, mv_5, rv_5),
    m2: createStdMat('hsl(197, 31%, 62%)', 0, null, true, mv_5, rv_5),
    metal: createStdMat('hsl(233, 9.80%, 67.80%)', 0, null, true, mv_5, rv_5),
    black: createStdMat('hsl(0,0%,0%)', 0, null, true),
    m3: createStdMat('hsl(191, 38.90%, 67.30%)', 0, null, true, mv_5, rv_5),
};


export const CHICKEN_MAT = {
    body: stdMat('hsl(0, 0%, 100%)', 0, null, true),
    eye: stdMat('hsl(0, 0%, 100%)', 1),
    eyeBall: createBasicMat('hsl(0, 0.00%, 0.00%)').tag,
    red: stdMat('hsl(15, 88%, 37%)'),
    redF: stdMat('hsl(15, 88%, 37%)', 0, null, true),
    beak: stdMat('hsl(39, 91%, 49%)', 0, null, true),
    brow: stdMat('hsl(42, 68%, 69%)', 0, null, true),
    what: stdMat('hsl(33, 48%, 35%)'),
    inner: stdMat('hsl(145, 11.10%, 78.80%)', 0, null, true),
};


const mv_6 = 0.5;
const rv_6 = 0.7;
export const MATLIB = {
    white: createStdMat('hsl(0, 0%, 100%)', 1, null, true, mv_6, rv_6),
    yellow: createStdMat('hsl(48, 100%, 50%)', 1, null, true, mv_6, rv_6),
    dark: createStdMat('hsl(0, 88%, 3%)', 0, null, true, mv_6, rv_6),
    warm: createStdMat('hsl(34, 98%, 79%)', 0, null, true, mv_6, rv_6),
    pink: createStdMat('hsl(357, 72%, 69%)', 0, null, true, mv_6, rv_6),
    blue: createStdMat('hsl(229, 69%, 53%)', 0, null, true, mv_6, rv_6),
    dead: createStdMat('hsl(340, 43%, 77%)', 0, null, true, mv_6, rv_6),
    rose: createStdMat('hsl(331, 37%, 60%)', 0, null, true, mv_6, rv_6),
    //rose: createStdMat('hsl(336, 43%, 49%)', 0, null, true, mv_6, rv_6),
    dust: createStdMat('hsl(48, 17%, 60%)', 0, null, true, mv_6, rv_6),
    wood: createStdMat('hsl(250, 16%, 44%)', 1, null, true, mv_6, rv_6),

    m0: createStdMat('hsl(322, 50%, 59%)', 0, null, true, mv_6, rv_6),
    m1: createStdMat('hsl(244, 72%, 28%)', 0, null, true, mv_6, rv_6),
    m2: createStdMat('hsl(280, 56%, 38%)', 0, null, true, mv_6, rv_6),
    m3: createStdMat('hsl(248, 64%, 56%)', 0, null, true, mv_6, rv_6),
    m3nf: createStdMat('hsl(248, 64%, 56%)', 0, null, false, mv_6, rv_6),
    m4: createStdMat('hsl(240, 77%, 10%)', 0, null, true, mv_6, rv_6),

    m5: createStdMat('hsl(218, 86%, 68%)', 0, null, true, mv_6, rv_6),
    m6: createStdMat('hsl(20, 76%, 85%)', 0, null, true, mv_6, rv_6),
    m7: createStdMat('hsl(253, 72%, 39%)', 0, null, true, mv_6, rv_6),
    m8: createStdMat('hsl(239, 81%, 17%)', 0, null, true, mv_6, rv_6),
    m9: createStdMat('hsl(231, 38%, 47%)', 0, null, true, mv_6, rv_6),
    ma: createStdMat('hsl(251, 25%, 39%)', 0, null, true, mv_6, rv_6),
}


export const COACH_MAT = {
    D: stdMat('hsl(185, 59%, 66%)'),
    T: stdMat('hsl(280, 60%, 99%)'),
    F: stdMat('hsl(339, 28%, 75%)'),
    B: stdMat('hsl(5, 21%, 54%)'),
    L: stdMat('hsl(33, 26%, 71%)'),
    R: stdMat('hsl(7, 90%, 59%)'),
};


const ev = 0.1;
export const VERTICES = {
    D: stdMat('hsl(185, 59%, 66%)', ev),
    T: stdMat('hsl(280, 60%, 99%)', ev),
    F: stdMat('hsl(339, 28%, 75%)', ev),
    B: stdMat('hsl(5, 21%, 54%)', ev),
    L: stdMat('hsl(33, 26%, 71%)', ev),
    R: stdMat('hsl(7, 90%, 59%)', ev),
};

export const NEW_VERTICES = {
    D: stdNewMat('hsl(185, 59%, 66%)', ev),
    T: stdNewMat('hsl(280, 60%, 99%)', ev),
    F: stdNewMat('hsl(339, 28%, 75%)', ev),
    B: stdNewMat('hsl(5, 21%, 54%)', ev),
    L: stdNewMat('hsl(33, 26%, 71%)', ev),
    R: stdNewMat('hsl(7, 90%, 59%)', ev),
};


function MatList() {
    const colorList = [MATLIB, OGRE_MAT, ICEBOX_MAT][2];
    const a = 0.5;
    const start = Object.keys(colorList).length - 1;

    const boxMesh = (mat, i) => {
        return (
            <mesh position={[(i*2 - start) * a, 0, 0]} key={i}>
                <boxGeometry args={[a, a, a]} />
                {mat.tag ? mat.tag : mat}
            </mesh>
        );
    };
    
    return (
        <group position={[0, -1.5, 0]}>
            {Object.entries(colorList).map(
                ([_, mat], i) => boxMesh(mat, i))
            }
        </group>
    );
}

export default MatList;