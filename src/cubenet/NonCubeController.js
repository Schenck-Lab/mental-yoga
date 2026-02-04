// cubenet/CubeController.js
import { HALF_PI, HALF_UNIT } from './cubeThreeModel';
import { NON_CUBE_MNETS } from './manifestNets';
import { FACE_LABEL, FACE_LOCAL_FRAME_MAP } from './cubeSpec';
import { ANIMATION_MODE } from './cubeThreeModel';
import { CUBE_ID } from '../scene/cubeCharacters';
import { CUBE_LEVEL_INIT } from '../scene/config';
import { easeCubicInOut, easeSinInOut } from 'd3-ease';


const MNETS_KEY = Object.keys(NON_CUBE_MNETS);

const HINGE_TABLE = {
    xp: {
        offset: [+HALF_UNIT, 0, 0],
        hingeAxis: 'z',
        rotLimit: +HALF_PI,
    },
    xn: {
        offset: [-HALF_UNIT, 0, 0],
        hingeAxis: 'z',
        rotLimit: -HALF_PI,
    },
    zp: {
        offset: [0, 0, +HALF_UNIT],
        hingeAxis: 'x',
        rotLimit: -HALF_PI,
    },
    zn: {
        offset: [0, 0, -HALF_UNIT],
        hingeAxis: 'x',
        rotLimit: +HALF_PI,
    },
};


export default class NonCubeController {

    constructor() {
        this.cubeId = CUBE_ID.CEEKIO;

        // status
        this.rigRefsReady = false;
        this.init = false;
        
        // Rig refs
        this.root = undefined;
        this.rigSlots = ['face', 'xp', 'xn', 'zp', 'zn'];
        this.faceRigs = Object.fromEntries(
            Object.values(FACE_LABEL).map((fLabel) => [fLabel, {}])
        );

        // Cube-net
        this.rigDirty = false;
        this.manifestMatrix = null;
        this.rootIndex = [0, 0];
        this.guide = null;

        this.animationMode = ANIMATION_MODE.BLOSSOM;
        this.CUBE_NET_ANIMATION_SPEED = 20;
        this.t100 = 100;
        this.p200 = 100;
        this.tVector = [1, 1, 1, 1, 1];

        this.sliderRef = undefined;
        this.isAutoPlay = false;
    }


    attachFaceRig(label, refs) {
        // 1. Bind basic face and edge refs
        Object.assign(this.faceRigs[label], refs);

        // 2. Build neighbor edge mapping (rig-level topology)
        const edgeList = [refs.xp, refs.zn, refs.xn, refs.zp];
        const neibFace = FACE_LOCAL_FRAME_MAP[label];

        ['xp', 'zn', 'xn', 'zp'].forEach((key, i) => {
            this.faceRigs[label][neibFace[key]] = edgeList[i];
        });
    }


    checkRigRefs() {
        this.rigRefsReady = this.root && Object.keys(FACE_LABEL).every((f) => {
            const currFace = this.faceRigs[f];
            return this.rigSlots.every((e) => currFace[e]);
        });
        if (!this.rigRefsReady) {
            console.warn('[Loading rig refs...]');
            return;
        }
        console.log('[Rig Refs Check: Passed]');
    }         

    initCube() {
        this.setAnimationMode(ANIMATION_MODE.BLOSSOM);
        //this.setManifestMatrix(NON_CUBE_MNETS[MNETS_KEY[41]].outputMatrix);
        this.setManifestMatrix(null);
        
        const init = CUBE_LEVEL_INIT[CUBE_ID.CEEKIO];   // -- the same as cookie's
        this.root.current.position.set(...init.pos);
        this.t100 = init.t100;

        this.init = true;
        console.log('[Cube Init: done]');
    }

    rotateToPose(dummy) {
        return;
    }

    attachSliderRef(sliderRef) {
        if (sliderRef && this.sliderRef !== sliderRef) {
            this.sliderRef = sliderRef;
            console.log('[sliderRef attached.]');
        }
    }

    setCubePosition(pos) {
        if (!this.root) return;
        this.root.current.position.set(...pos);
    }

    resetTimeParameters(value = 0) {
        if (value < 0 || value > 100) {
            throw Error(`Invalid argument: value=${value}`);
        }
        this.t100 = value;
        this.p200 = value;
        if (this.sliderRef?.current) {
            this.sliderRef.current.value = value;
        }
    }

    resetToCubeLocked() {
        this.resetTimeParameters(100);
        this.isAutoPlay = false;
    }

    resetToNetLocked() {
        this.resetTimeParameters(0);
        this.isAutoPlay = false;
    }

    setVisible(flag) {
        this.root.current.visible = flag;
    }

    // extract root indices
    setManifestMatrix(matrix) {
        if (!matrix) return;
        
        const getRootIndex = (mat) => {
            for (let r = 0; r < 8; ++r) {
                for (let c = 0; c < 8; ++c) {
                    if (mat[r][c] === 2) {
                        return {r, c};
                    }
                }
            }
            return null;
        };
        this.manifestMatrix = matrix.map(row => [...row]);  // !deep copy
        this.rootIndex = getRootIndex(matrix);
        this.rigDirty = true;
    }

    setAnimationMode(mode) {
        this.animationMode = mode;
        // this.resetTimeParameters(100);
        this.resetTimeParameters(CUBE_LEVEL_INIT[CUBE_ID.CEEKIO].t100);
        if (this.sliderRef?.current) {
            //this.sliderRef.current.value = 100;
            this.sliderRef.current.value = CUBE_LEVEL_INIT[CUBE_ID.CEEKIO].t100;
        }
    }

    setAutoPlay(flag) {
        if (flag) this.p200 = this.t100;
        this.isAutoPlay = flag;
    }

    updateAnimation(delta) {
        if (!this.rigRefsReady) {
            this.checkRigRefs();
            return;
        }
        if (!this.init) {
            this.initCube();
            return;
        }
        if (this.isRotating) {
            this.applyRotation(delta);
            return;
        }
        if (this.rigDirty) {
            
            this.#computeRigGuide();
            this.#rebuildRigHierarchy();
            this.rigDirty = false;
            return;
        }
        if (this.isAutoPlay) {
            this.updateT100FromDelta(delta);
            if (this.sliderRef?.current) {
                this.sliderRef.current.value = this.t100;
            }
        }
        if (this.guide) {
            this.#applyHingeRotations();
        }
    }


    // core
    // /** Assemble faces into a raw cube pose (local transforms only). */
    #assembleRawCube() {
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
    
        ['D', 'F', 'B', 'L', 'R', 'T'].forEach((f) => {
            const g = this.faceRigs[f]?.face?.current;
            if (!g) return;
            g.position.set(...pos[f]);
            g.rotation.set(...rot[f]);
        });
    }
    
    /** Build guide for current net state. */
    #computeRigGuide() {
        if (!this.manifestMatrix) {
            this.guide = null;
            return;
        }
        const guide = [];
        const facePool = ['D', 'F', 'L', 'B', 'R', 'T'];
        let fPointer = 0;

        
        const dfs = (pFace, pAxis, r, c) => {
            
            if (r < 0 || r === 8 || c < 0 || c === 8) return;
            if (this.manifestMatrix[r][c] !== 1 && this.manifestMatrix[r][c] !== 2) return;
            if (fPointer >= 6) return;
    
            

            const cFace = facePool[fPointer];
            this.manifestMatrix[r][c] = cFace.charCodeAt(0);
            fPointer++;

            if (pFace) {
                guide.push({ pFace, pAxis, cFace });
            }
            dfs(cFace, 'xp', r, c + 1);
            dfs(cFace, 'zn', r - 1, c);
            dfs(cFace, 'xn', r, c - 1);
            dfs(cFace, 'zp', r + 1, c);
        }

        dfs(null, null, this.rootIndex.r, this.rootIndex.c);
        this.guide = guide;
    }
    
    #detachFaces() {
        for (const face of Object.values(this.faceRigs)) {
            const group = face?.face?.current;
            if (!group) continue;
    
            if (group.parent) {
                group.parent.remove(group);
            }
            group.position.set(0, 0, 0);
            group.rotation.set(0, 0, 0);
        }
    }
    
    #rebuildRigHierarchy() {
        if (!this.root?.current || !this.faceRigs || !this.guide) {
            return;
        }
        this.#detachFaces();
    
        const baseGroup = this.faceRigs.D?.face?.current;
        if (!baseGroup) return;
    
        this.root.current.add(baseGroup);
        this.faceRigs.D?.face?.current.position.set(0, -HALF_UNIT, 0);
    
        this.guide.forEach(({ pFace, pAxis, cFace }, i) => {
            const parentEdgeGroup = this.faceRigs?.[pFace]?.[pAxis]?.current;
            const childGroup = this.faceRigs?.[cFace]?.face?.current;
    
            if (!parentEdgeGroup || !childGroup) {
                console.warn(`Failed to rebind ${cFace} to ${pFace}.`);
                return;
            }
            parentEdgeGroup.add(childGroup);
            childGroup.position.set(...HINGE_TABLE[pAxis].offset);
        });
    }
    
    updateT100FromDelta(delta) {
        const MAX_PROGRESS = 200;
        this.p200 += delta * this.CUBE_NET_ANIMATION_SPEED;
        
        if (this.p200 >= MAX_PROGRESS) {
            this.p200 -= MAX_PROGRESS;
        }
        this.t100 = Math.min(this.p200, MAX_PROGRESS - this.p200);
    }
    
    #computeHingeTVector() {
        const N_HINGE = 5;
        const STEP = 20;  // (100 / N_HINGE);
    
        if (this.animationMode === ANIMATION_MODE.BLOSSOM) {
            const t = this.t100 / 100;
            const easeT = easeSinInOut(t);
            return Array(N_HINGE).fill(easeT);
        }
    
        const tVector = Array(N_HINGE).fill(0);
        let temp = this.t100;
    
        for (let i = 0; i < N_HINGE; ++i) {
            if (temp <= 0) break;
            tVector[i] = Math.min(temp / STEP, 1);
            tVector[i] = easeCubicInOut(tVector[i]);
            temp -= STEP;
        }
    
        switch (this.animationMode) {
            case ANIMATION_MODE.WAVING:
                return tVector;
    
            case ANIMATION_MODE.ROLLING:
                return tVector.slice().reverse();
    
            default:
                return Array(N_HINGE).fill(1);
        }
    }
    
    #applyHingeRotations() {
        if (!this.manifestMatrix) {
            this.#assembleRawCube();
            return;
        }
        if (!this.guide || !this.faceRigs) return;
    
        this.tVector = this.#computeHingeTVector();
    
        for (let i = 0; i < 5; ++i) {
            const { pFace, pAxis } = this.guide[i];
            const { hingeAxis, rotLimit } = HINGE_TABLE[pAxis];
    
            const edgeGroup = this.faceRigs?.[pFace]?.[pAxis]?.current;
            if (!edgeGroup) continue;
    
            edgeGroup.rotation[hingeAxis] = this.tVector[i] * rotLimit;
        }
    }
}
