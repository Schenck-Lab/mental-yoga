// src/cubenet/cubeThreeModel


/**
 * Three.js face–edge assembly model for a foldable cube.
 *
 *              +----- Ez- -----+ - - - - - - - +
 *              |               |               |
 *              |               |               
 *             Ex-     F.p     Ex+     F.c      |
 *              |               |                
 *              |               |               |
 *              +----- Ez+ -----+ - - - - - - - +
 * 
 *                
 * Each cube face is represented as a parent Object3D with four child "edge"
 * objects, corresponding to the face-local directions (xp, zn, xn, zp).
 * Edge objects are positioned at half-unit offsets and remain unrotated.
 *
 * To attach a child face to a parent face, the child face is added to the
 * corresponding edge object of the parent:
 *   - POS_TABLE   specifies the translation needed to align the faces.
 *   - ROT_TABLE   specifies the in-plane rotation of the child face.
 *
 * During folding animation, these edge objects act as rotation hinges:
 *   - ROT_AXES[edgeType].axis  defines the rotation axis.
 *   - ROT_AXES[edgeType].rad90 defines the ±90° rotation bound.
 *
 * This model bridges cubeSpec (abstract face relations) with Three.js
 * scene-graph mechanics for cube-net assembly and folding animation.
 */
export const HALF_UNIT = 0.5;
export const HALF_PI   = Math.PI * 0.5;

export const CHILD_FACE_ATTACH_OFFSET = {
    xn: [-HALF_UNIT, 0, 0],
    zp: [0, 0, +HALF_UNIT],
    xp: [+HALF_UNIT, 0, 0],
    zn: [0, 0, -HALF_UNIT],
};

export const CHILD_FACE_ATTACH_ROTNUM = {
    D: {R: 0, B: 0, L: 0, F: 0},
    T: {R: 2, F: 0, L: 2, B: 0},
    F: {R: 3, L: 1, T: 0, D: 0},
    B: {R: 1, T: 0, L: 3, D: 0},
    L: {B: 1, T: 2, F: 3, D: 0},
    R: {T: 2, B: 3, F: 1, D: 0},
};

export const HINGE_ROTATION_SPEC = {
    xp: {axis: 'z', limitRad: +HALF_PI},
    xn: {axis: 'z', limitRad: -HALF_PI},
    zp: {axis: 'x', limitRad: -HALF_PI},
    zn: {axis: 'x', limitRad: +HALF_PI},
};


export const ANIMATION_MODE = {
    WAVING: 'waving',
    ROLLING: 'rolling',
    BLOSSOM: 'blossom',
};

export const INIT_POS = {
    T: [0, +HALF_UNIT, 0],
    D: [0, -HALF_UNIT, 0],
    F: [0, 0, +HALF_UNIT],
    B: [0, 0, -HALF_UNIT],
    L: [-HALF_UNIT, 0, 0],
    R: [+HALF_UNIT, 0, 0],
};

export const INIT_ROT = {
    T: [-Math.PI, 0, 0],
    D: [ 0,       0, 0],
    F: [-HALF_PI, 0, 0],
    B: [+HALF_PI, 0, 0],
    L: [0, 0, -HALF_PI],
    R: [0, 0, +HALF_PI],
};