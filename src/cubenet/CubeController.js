// cubenet/CubeController.js
import { Quaternion } from 'three';
import { CUBE_MNETS } from './manifestNets';
import { FACE_LABEL, FACE_LOCAL_FRAME_MAP, CUBE_ORIENTATION_MAP } from './cubeSpec';
import { ANIMATION_MODE } from './cubeThreeModel';
import { CUBE_ID } from '../scene/cubeCharacters';
import { CUBE_LEVEL_INIT } from '../scene/config';
import {
    computeRigGuide,
    rebuildRigHierarchy,
    updateT100FromDelta,
    applyHingeRotations,
} from './cubeRigCore';
import { createInteractor } from './cubeInteraction';


const MNETS_KEY = Object.keys(CUBE_MNETS);


export default class CubeController {

    constructor(cubeId = 'cookie') {
        if (!Object.values(CUBE_ID).includes(cubeId)) {
            throw new Error(`Invalid cubeId: ${cubeId}`);
        }
        this.cubeId = cubeId;

        // status
        this.rigRefsReady = false;
        this.init = false;
        
        // Rig refs
        this.root = undefined;
        this.rigSlots = ['face', 'xp', 'xn', 'zp', 'zn'];
        this.faceRigs = Object.fromEntries(
            Object.values(FACE_LABEL).map((fLabel) => [fLabel, {}])
        );

        // Rotation
        this.isRotating = false;
        this.currPose = 'TF';
        this.nextPose = 'TF';
        this.qtnFrom = new Quaternion();
        this.qtnCurr = new Quaternion();
        this.qtnTo   = new Quaternion();
        this.t_cube_rot = 1;

        this.CUBE_ROTATION_INIT_SPEED = 0;
        this.CUBE_ROTATION_ACC = 0.5;
        this.currSpeed = this.CUBE_ROTATION_INIT_SPEED;
        this.easeFn = (t) => t;

        // Cube-net
        this.rigDirty = false;
        this.manifestMatrix = null;
        this.baseId = 0;
        this.faceIndices = null;
        this.hierMatrix = null;
        this.guide = null;

        this.animationMode = ANIMATION_MODE.BLOSSOM;
        this.CUBE_NET_ANIMATION_SPEED = 20;
        this.t100 = 100;
        this.p200 = 100;
        this.tVector = [1, 1, 1, 1, 1];

        this.sliderRef = undefined;
        this.isAutoPlay = false;

        // Interaction
        this.interactor = createInteractor(this);
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
        this.setManifestMatrix(CUBE_MNETS[MNETS_KEY[0]].outputMatrix);
        this.setBaseId(0);

        const init = CUBE_LEVEL_INIT[this.cubeId];
        this.root.current.position.set(...init.pos);
        this.t100 = init.t100;


        this.init = true;
        console.log('[Cube Init: done]');
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

    /* Jump to a target orientation (world/observer-frame pose). */
    rotateToPose(targetPose) {
        if (this.isRotating) {
            return;
        }
        if (!CUBE_ORIENTATION_MAP.hasOwnProperty(targetPose)) {
            throw new Error(`Invalid rotation key: '${targetPose}'`);
        }
        this.nextPose = targetPose;
        this.qtnTo.set(...CUBE_ORIENTATION_MAP[this.nextPose].qtn);
        this.t_cube_rot = 0;
        this.isRotating = true;
        this.rigDirty = true;
    }

    /* Apply one discrete 90° step rotation in the observer (world) frame. */
    rotateStep(direction) {
        if (this.isRotating) {
            return;
        }
        this.nextPose = CUBE_ORIENTATION_MAP[this.nextPose][direction];
        this.qtnTo.set(...CUBE_ORIENTATION_MAP[this.nextPose].qtn);
        this.t_cube_rot = 0;
        this.isRotating = true;
        this.rigDirty = true;
    }

    applyRotation(delta) {
        if (!this.isRotating) return;

        // update speed and time
        this.currSpeed += this.CUBE_ROTATION_ACC;
        this.t_cube_rot += delta * this.currSpeed;

        // reach to target pose
        if (this.t_cube_rot >= 1) {
            this.root.current.quaternion.copy(this.qtnTo);
            this.t_cube_rot = 1;
            this.currPose = this.nextPose;
            this.qtnFrom.copy(this.qtnTo);
            this.currSpeed = this.CUBE_ROTATION_INIT_SPEED;
            this.isRotating = false;
            return;
        }
        // rotating
        const easedT = this.easeFn(this.t_cube_rot);
        this.qtnCurr.slerpQuaternions(this.qtnFrom, this.qtnTo, easedT);
        this.root.current.quaternion.copy(this.qtnCurr);
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

    setManifestMatrix(matrix) {
        const getFacesCoordinate = (mat) => {
            const list = [];
            for (let r = 0; r < 8; ++r) {
                for (let c = 0; c < 8; ++c) {
                    if (mat[r][c] === 1) list.push({ rid: r, cid: c });
                }
            }
            return list;
        };

        this.manifestMatrix = matrix;
        this.faceIndices = getFacesCoordinate(matrix);
        this.rigDirty = true;
        //this.resetTimeParameters(100);
        this.resetTimeParameters(CUBE_LEVEL_INIT[this.cubeId].t100);
    }

    setBaseId(baseId) {
        this.baseId = baseId;
        this.rigDirty = true;
        //this.resetTimeParameters(100);
        this.resetTimeParameters(CUBE_LEVEL_INIT[this.cubeId].t100);
    }

    setAnimationMode(mode) {
        this.animationMode = mode;
        // this.resetTimeParameters(100);
        this.resetTimeParameters(CUBE_LEVEL_INIT[this.cubeId].t100);
        if (this.sliderRef?.current) {
            //this.sliderRef.current.value = 100;
            this.sliderRef.current.value = CUBE_LEVEL_INIT[this.cubeId].t100;
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
            computeRigGuide(this);
            rebuildRigHierarchy(this);
            this.rigDirty = false;
            return;
        }
        if (this.isAutoPlay) {
            updateT100FromDelta(this, delta);
            if (this.sliderRef?.current) {
                this.sliderRef.current.value = this.t100;
            }
        }
        if (this.guide) {
            applyHingeRotations(this);
        }
        if (this.interactor) {
            this.interactor?.update();
        }
    }
}
