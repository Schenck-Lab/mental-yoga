// cubenet/cubeRigCore.js
import { easeCubicInOut, easeSinInOut } from 'd3-ease';

import {
    FACE_LOCAL_FRAME_MAP,
    FACE_XZ_NEIGHBOR_MAP,
    CUBE_ORIENTATION_MAP,
} from './cubeSpec';

import {
    CHILD_FACE_ATTACH_OFFSET,
    CHILD_FACE_ATTACH_ROTNUM,
    HINGE_ROTATION_SPEC,
    HALF_UNIT,
    HALF_PI,
    ANIMATION_MODE,
} from './cubeThreeModel';

/** Assemble faces into a raw cube pose (local transforms only). */
export function assembleRawCube(faceRigs, faceLabelList) {
    const h = HALF_UNIT;
    const p = Math.PI;
    const q = p * 0.5;

    const pos = {
        T: [0, +h, 0],
        D: [0, -h, 0],
        F: [0, 0, +h],
        B: [0, 0, -h],
        L: [-h, 0, 0],
        R: [+h, 0, 0],
    };

    const rot = {
        T: [-p, 0, 0],
        D: [ 0, 0, 0],
        F: [-q, 0, 0],
        B: [+q, 0, 0],
        L: [0, 0, -q],
        R: [0, 0, +q],
    };

    faceLabelList.forEach((f) => {
        const g = faceRigs[f]?.face?.current;
        if (!g) return;
        g.position.set(...pos[f]);
        g.rotation.set(...rot[f]);
    });
}

/** Build hierMatrix + guide for current net state. */
export function computeRigGuide(ctrl) {
    const { manifestMatrix, faceIndices, baseId, currPose } = ctrl;

    if (!manifestMatrix || !faceIndices || faceIndices.length === 0) {
        ctrl.hierMatrix = null;
        ctrl.guide = null;
        return;
    }

    const hierMatrix = manifestMatrix.map((row) =>
        row.map((cell) => (cell === 1 ? 'xx' : '__'))
    );
    const guide = [];

    function dfs(pKey, currFace, r, c) {
        if (r < 0 || r === 8 || c < 0 || c === 8) return;
        if (hierMatrix[r][c] !== 'xx') return;

        hierMatrix[r][c] = currFace;
        const cKey = currFace[0];
        const rNum = Number(currFace[1]);

        if (pKey) {
            const edge = FACE_LOCAL_FRAME_MAP[pKey][cKey];
            const rotNum = CHILD_FACE_ATTACH_ROTNUM[pKey][cKey];
            const position = CHILD_FACE_ATTACH_OFFSET[edge];
            guide.push({ pKey, cKey, edge, rotNum, position });
        }

        const list = FACE_XZ_NEIGHBOR_MAP[cKey][rNum];
        dfs(cKey, list[0], r, c + 1);
        dfs(cKey, list[1], r - 1, c);
        dfs(cKey, list[2], r, c - 1);
        dfs(cKey, list[3], r + 1, c);
    }

    const baseFace = CUBE_ORIENTATION_MAP[currPose].base;
    const { rid, cid } = faceIndices[baseId];
    dfs(null, baseFace, rid, cid);

    ctrl.hierMatrix = hierMatrix;
    ctrl.guide = guide;
}

function _detachFaces(faceRigs) {
    for (const face of Object.values(faceRigs)) {
        const group = face?.face?.current;
        if (!group) continue;

        if (group.parent) {
            group.parent.remove(group);
        }
        group.position.set(0, 0, 0);
        group.rotation.set(0, 0, 0);
    }
}

export function rebuildRigHierarchy(ctrl) {
    const { root, faceRigs, guide, currPose, tVector } = ctrl;
    if (!root?.current || !faceRigs || !guide) return;

    _detachFaces(faceRigs);

    const baseFace = CUBE_ORIENTATION_MAP[currPose].base;
    const baseKey = baseFace[0];
    const baseGroup = faceRigs[baseKey]?.face?.current;
    if (!baseGroup) return;

    root.current.add(baseGroup);
    assembleRawCube(faceRigs, [baseKey]);

    guide.forEach(({ pKey, cKey, rotNum, position, edge }, i) => {
        const parentEdgeGroup = faceRigs?.[pKey]?.[cKey]?.current;
        const childGroup = faceRigs?.[cKey]?.face?.current;

        if (!parentEdgeGroup || !childGroup) {
            console.warn(`Failed to rebind ${cKey} to ${pKey}.`);
            return;
        }

        parentEdgeGroup.add(childGroup);
        childGroup.position.set(...position);
        childGroup.rotation.set(0, rotNum * HALF_PI, 0);

        const { axis, limitRad } = HINGE_ROTATION_SPEC[edge];
        parentEdgeGroup.rotation[axis] = (tVector?.[i] ?? 1) * limitRad;
    });
}

export function updateT100FromDelta(ctrl, delta) {
    const MAX_PROGRESS = 200;
    ctrl.p200 += delta * ctrl.CUBE_NET_ANIMATION_SPEED;
    
    if (ctrl.p200 >= MAX_PROGRESS) {
        ctrl.p200 -= MAX_PROGRESS;
    }
    ctrl.t100 = Math.min(ctrl.p200, MAX_PROGRESS - ctrl.p200);
}

function _computeHingeTVector(ctrl) {
    const N_HINGE = 5;
    const STEP = 20;  // (100 / N_HINGE);

    if (ctrl.animationMode === ANIMATION_MODE.BLOSSOM) {
        const t = ctrl.t100 / 100;
        const easeT = easeSinInOut(t);
        return Array(N_HINGE).fill(easeT);
    }

    const tVector = Array(N_HINGE).fill(0);
    let temp = ctrl.t100;

    for (let i = 0; i < N_HINGE; ++i) {
        if (temp <= 0) break;
        tVector[i] = Math.min(temp / STEP, 1);
        tVector[i] = easeCubicInOut(tVector[i]);
        temp -= STEP;
    }

    switch (ctrl.animationMode) {
        case ANIMATION_MODE.WAVING:
            return tVector;

        case ANIMATION_MODE.ROLLING:
            return tVector.slice().reverse();

        default:
            return Array(N_HINGE).fill(1);
    }
}

export function applyHingeRotations(ctrl) {
    if (!ctrl.guide || !ctrl.faceRigs) return;

    ctrl.tVector = _computeHingeTVector(ctrl);

    for (let i = 0; i < 5; ++i) {
        const { pKey, cKey, edge } = ctrl.guide[i];
        const { axis, limitRad } = HINGE_ROTATION_SPEC[edge];

        const edgeGroup = ctrl.faceRigs?.[pKey]?.[cKey]?.current;
        if (!edgeGroup) continue;

        edgeGroup.rotation[axis] = ctrl.tVector[i] * limitRad;
    }
}
