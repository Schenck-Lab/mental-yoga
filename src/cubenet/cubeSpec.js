// src/cubenet/cubeSpec.js


/**
 * World Coordinate System
 * 
 *   +X: to the right
 *   +Y: up
 *   +Z: toward the viewer (Front)
 *                  ▲
 *                  | (y-axis)
 *                  | 
 *                  |
 *                  *---------*
 *                 /   Top   /| 
 *                /         / | Right
 *               *---------*  |
 *               |         |  *---------▶ (x-axis)
 *               |  Front  | /
 *               |         |/
 *               *---------*
 *              /
 *             /
 *   (z-axis) /
 * 
 * Face labels are named from the observer's perspective:
 *   R (Right,+X), T (Top, +Y), F (Front,+Z), 
 *   L (Left, -X), D (Down,-Y), B (Back, -Z), 
 */
export const FACE_LABEL = Object.freeze({
    T: 'T', 
    D: 'D', 
    F: 'F', 
    B: 'B', 
    L: 'L', 
    R: 'R',
});

export const FACE_BITS = Object.freeze({
    T: 0b000001,
    D: 0b000010,
    F: 0b000100,
    B: 0b001000,
    L: 0b010000,
    R: 0b100000,
});


/**
 * Rotation Convention (Right-Hand Rule)
 *
 * All rotations in this project follow the right-hand rule, consistent with
 * Three.js and most modern 3D engines.
 *
 * Rule description:
 *   - Point the thumb of the right hand in the direction of the rotation axis.
 *   - The curl of the fingers indicates the positive rotation direction.
 */


/**
 * FACE_LOCAL_FRAME_MAP specifies the local reference frame for each cube face.
 * 
 *           zn
 *     +-----? ----+ 
 *     |           | 
 *  xn ?   Label   ? xp
 *     |           | 
 *     +---- ? ----+ 
 *           zp
 * 
 * It supports the following bidirectional query mappings:
 *     (parent_face, child_face) -> local_axis,
 *     (parent_face, local_axis) -> child_face,
 * 
 *     +---- B ----+      +---- F ----+      +---- D ----+
 *     |           |      |           |      |           |
 *     L     D     R      L     T     R      L     F     R
 *     |           |      |           |      |           |
 *     +---- F ----+      +---- B ----+      +---- T ----+
 * 
 *     +---- B ----+      +---- B ----+      +---- T ----+
 *     |           |      |           |      |           |
 *     T     L     D      D     R     T      L     B     R
 *     |           |      |           |      |           |
 *     +---- F ----+      +---- F ----+      +---- D ----+
 * 
 */
export const FACE_LOCAL_FRAME_MAP = {
    D: {
        R: 'xp', B: 'zn', L: 'xn', F: 'zp', 
        xp: 'R', zn: 'B', xn: 'L', zp: 'F',
    },
    T: {
        R: 'xp', F: 'zn', L: 'xn', B: 'zp',
        xp: 'R', zn: 'F', xn: 'L', zp: 'B',
    },
    F: {
        R: 'xp', D: 'zn', L: 'xn', T: 'zp',
        xp: 'R', zn: 'D', xn: 'L', zp: 'T',
    },
    B: {
        R: 'xp', T: 'zn', L: 'xn', D: 'zp',
        xp: 'R', zn: 'T', xn: 'L', zp: 'D',
    },
    L: {
        D: 'xp', B: 'zn', T: 'xn', F: 'zp',
        xp: 'D', zn: 'B', xn: 'T', zp: 'F',
    },
    R: {
        T: 'xp', B: 'zn', D: 'xn', F: 'zp',
        xp: 'T', zn: 'B', xn: 'D', zp: 'F',
    },
};


/**
 * FACE_XZ_NEIGHBOR_MAP
 *
 * A derived lookup table describing face-state adjacency under a fixed
 * world-aligned XZ observation frame.
 *
 * Query shape:
 *   FACE_XZ_NEIGHBOR_MAP[currFaceLabel][currRotNum] -> 
 *   [
 *       `{world_xp_neibFaceLabel}{neibRotNum}`, 
 *       `{world_zn_neibFaceLabel}{neibRotNum}`,
 *       `{world_xn_neibFaceLabel}{neibRotNum}`,
 *       `{world_zp_neibFaceLabel}{neibRotNum}`,
 *   ]
 *
 * Notes:
 *   - Directions [xp, zn, xn, zp] are WORLD directions, not face-local axes.
 *   - This table is a frame-dependent derivation of FACE_LOCAL_FRAME_MAP.
 *   - It encodes adjacency under a chosen observation frame, without assuming
 *     cube assembly or net structure.
 * 
 * Use:
 *   When a 2D net is embedded on the world XZ plane and a base face-state is
 *   anchored to a chosen net cell, this map provides the world-direction
 *   neighbor face-states needed to propagate states during DFS traversal,
 *   ensuring consistent orientation assignment (no getting lost) across the net.
 */
export const FACE_XZ_NEIGHBOR_MAP = {
    D: [
        ['R0', 'B0', 'L0', 'F0'],
        ['F1', 'R1', 'B1', 'L1'],
        ['L2', 'F2', 'R2', 'B2'],
        ['B3', 'L3', 'F3', 'R3'],
    ],
    T: [
        ['R2', 'F0', 'L2', 'B0'],
        ['B1', 'R3', 'F1', 'L3'],
        ['L0', 'B2', 'R0', 'F2'],
        ['F3', 'L1', 'B3', 'R1'],
    ],
    F: [
        ['R3', 'D0', 'L1', 'T0'],
        ['T1', 'R0', 'D1', 'L2'],
        ['L3', 'T2', 'R1', 'D2'],
        ['D3', 'L0', 'T3', 'R2'],
    ],
    B: [
        ['R1', 'T0', 'L3', 'D0'],
        ['D1', 'R2', 'T1', 'L0'],
        ['L1', 'D2', 'R3', 'T2'],
        ['T3', 'L2', 'D3', 'R0'],
    ],
    L: [
        ['D0', 'B1', 'T2', 'F3'],
        ['F0', 'D1', 'B2', 'T3'],
        ['T0', 'F1', 'D2', 'B3'],
        ['B0', 'T1', 'F2', 'D3'],
    ],
    R: [
        ['T2', 'B3', 'D0', 'F1'],
        ['F2', 'T3', 'B0', 'D1'],
        ['D2', 'F3', 'T0', 'B1'],
        ['B2', 'D3', 'F0', 'T1'],
    ],
};


/**
 * CUBE_ORIENTATION_MAP
 *
 * Discrete lookup table for the 24 rigid orientations of a cube.
 *
 * Key:
 *   - `${Top}${Front}`: orientation identifier defined by the face on top
 *     and the face facing forward in world coordinates.
 *
 * Each entry provides:
 *   - qtn  : Quaternion [x, y, z, w] representing this orientation
 *            in world coordinates (right-handed convention).
 *   - xp/xn: Next orientation after ±90° rotation about world X axis.
 *   - yp/yn: Next orientation after ±90° rotation about world Y axis.
 *   - zp/zn: Next orientation after ±90° rotation about world Z axis.
 *   - base : Base (bottom) face label and its in-plane rotation,
 *            encoded as `${Face}${RotationNum}` (RotationNum ∈ {0,1,2,3}).
 *
 * Notes:
 *   - The `base` field alone uniquely determines the orientation, but the
 *     `${Top}${Front}` key is retained for clarity and debugging.
 *   - Face labels and axis conventions are consistent with FACE_LOCAL_FRAME_MAP.
 */
const cos45 = Math.cos(Math.PI / 4);
const cos60 = 0.5;

export const CUBE_ORIENTATION_MAP = {
    // -------------------------------------------------- TOP
    TF: {
        qtn: [0, 0, 0, 1],
        xp: 'BT', xn: 'FD', 
        yp: 'TL', yn: 'TR', 
        zp: 'RF', zn: 'LF',
        base: 'D0',
    },
    TL: {
        qtn: [0, -cos45, 0, -cos45],
        xp: 'RT', xn: 'LD', 
        yp: 'TB', yn: 'TF', 
        zp: 'FL', zn: 'BL',
        base: 'D1',
    },
    TB: {
        qtn: [0, -1, 0, 0],
        xp: 'FT', xn: 'BD', 
        yp: 'TR', yn: 'TL', 
        zp: 'LB', zn: 'RB',
        base: 'D2',
    },
    TR: {
        qtn: [0, -cos45, 0, cos45],
        xp: 'LT', xn: 'RD', 
        yp: 'TF', yn: 'TB', 
        zp: 'BR', zn: 'FR',
        base: 'D3',
    },
    
    // ------------------------------------------------- Front
    FD: {
        qtn: [-cos45, 0, 0, cos45],
        xp: 'TF', xn: 'DB', 
        yp: 'FL', yn: 'FR', 
        zp: 'RD', zn: 'LD',
        base: 'B0',
    },
    FL: {
        qtn: [-cos60, cos60, cos60, cos60],
        xp: 'RF', xn: 'LB', 
        yp: 'FT', yn: 'FD', 
        zp: 'DL', zn: 'TL',
        base: 'B1',
    },
    FT: {
        qtn: [0, cos45, cos45, 0],
        xp: 'DF', xn: 'TB', 
        yp: 'FR', yn: 'FL', 
        zp: 'LT', zn: 'RT',
        base: 'B2',
    },
    FR: {
        qtn: [cos60, cos60, cos60, -cos60],
        xp: 'LF', xn: 'RB', 
        yp: 'FD', yn: 'FT', 
        zp: 'TR', zn: 'DR',
        base: 'B3',
    },

    // -------------------------------------------------- Left
    LD: {
        qtn: [cos60, -cos60, cos60, -cos60],
        xp: 'TL', xn: 'DR', 
        yp: 'LB', yn: 'LF', 
        zp: 'FD', zn: 'BD',
        base: 'R1',
    },
    LB: {
        qtn: [cos45, -cos45, 0, 0],
        xp: 'FL', xn: 'BR', 
        yp: 'LT', yn: 'LD', 
        zp: 'DB', zn: 'TB',
        base: 'R2',
    },
    LT: {
        qtn: [cos60, -cos60, -cos60, cos60],
        xp: 'DL', xn: 'TR', 
        yp: 'LF', yn: 'LB', 
        zp: 'BT', zn: 'FT',
        base: 'R3',
    },
    LF: {
        qtn: [0, 0, -cos45, cos45],
        xp: 'BL', xn: 'FR', 
        yp: 'LD', yn: 'LT', 
        zp: 'TF', zn: 'DF',
        base: 'R0',
    },

    // -------------------------------------------------- Back
    BD: {
        qtn: [0, -cos45, cos45, 0],
        xp: 'TB', xn: 'DF', 
        yp: 'BR', yn: 'BL', 
        zp: 'LD', zn: 'RD',
        base: 'F2',
    },
    BR: {
        qtn: [cos60, -cos60, cos60, cos60],
        xp: 'LB', xn: 'RF', 
        yp: 'BT', yn: 'BD', 
        zp: 'DR', zn: 'TR',
        base: 'F3',
    },
    BT: {
        qtn: [cos45, 0, 0, cos45],
        xp: 'DB', xn: 'TF', 
        yp: 'BL', yn: 'BR', 
        zp: 'RT', zn: 'LT',
        base: 'F0',
    },
    BL: {
        qtn: [cos60, cos60, -cos60, cos60],
        xp: 'RB', xn: 'LF', 
        yp: 'BD', yn: 'BT', 
        zp: 'TL', zn: 'DL',
        base: 'F1',
    },

    // ------------------------------------------------- Right
    RD: {
        qtn: [-cos60, -cos60, cos60, cos60],
        xp: 'TR', xn: 'DL', 
        yp: 'RF', yn: 'RB', 
        zp: 'BD', zn: 'FD',
        base: 'L3',
    },
    RF: {
        qtn: [0, 0, cos45, cos45],
        xp: 'BR', xn: 'FL', 
        yp: 'RT', yn: 'RD', 
        zp: 'DF', zn: 'TF',
        base: 'L0',
    },
    RT: {
        qtn: [cos60, cos60, cos60, cos60],
        xp: 'DR', xn: 'TL', 
        yp: 'RB', yn: 'RF', 
        zp: 'FT', zn: 'BT',
        base: 'L1',
    },
    RB: {
        qtn: [cos45, cos45, 0, 0],
        xp: 'FR', xn: 'BL', 
        yp: 'RD', yn: 'RT', 
        zp: 'TB', zn: 'DB',
        base: 'L2',
    },

    // -------------------------------------------------- Down
    DB: {
        qtn: [-1, 0, 0, 0],
        xp: 'FD', xn: 'BT', 
        yp: 'DL', yn: 'DR', 
        zp: 'RB', zn: 'LB',
        base: 'T0',
    },
    DL: {
        qtn: [-cos45, 0, cos45, 0],
        xp: 'RD', xn: 'LT', 
        yp: 'DF', yn: 'DB', 
        zp: 'BL', zn: 'FL',
        base: 'T1',
    },
    DF: {
        qtn: [0, 0, 1, 0],
        xp: 'BD', xn: 'FT', 
        yp: 'DR', yn: 'DL', 
        zp: 'LF', zn: 'RF',
        base: 'T2',
    },
    DR: {
        qtn: [cos45, 0, cos45, 0],
        xp: 'LD', xn: 'RT', 
        yp: 'DB', yn: 'DF', 
        zp: 'FR', zn: 'BR',
        base: 'T3',
    },
};

