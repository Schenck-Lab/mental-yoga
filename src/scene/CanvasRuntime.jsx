import { useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useFrame } from '@react-three/fiber';
import { parseQcode } from '../utils/utils';
import { CUBE_ID } from './cubeCharacters';
import { ALL_MNETS } from '../cubenet/manifestNets';
import { HALF_UNIT } from '../cubenet/cubeThreeModel';
import { getEpochMS, toTimeCT } from '../utils/utils';
import { EXPERIMENT_PROBBLEM_SET } from '../_experiment/questionLibrary';


const h = HALF_UNIT;
const INTRO_STATUS = {
    1: [ { cubeId: CUBE_ID.COOKIE,         pos: [-1,h,0], vis: true, t100: 100}, 
         { cubeId: CUBE_ID.CEEKIO,         pos: [+1,h,0], vis: true, t100: 100}],
    2: [ { cubeId: CUBE_ID.CHICKEN,        pos: [0,h,0], vis: true, t100: 100} ],
    3: [ { cubeId: CUBE_ID.PIPE,           pos: [0,h,0], vis: true, t100: 100} ],
    4: [ { cubeId: CUBE_ID.OGRE,           pos: [0,h,0], vis: true, t100: 100} ],
    5: [ { cubeId: CUBE_ID.ICEBOX,         pos: [0,h,0], vis: true, t100: 100}, 
         { cubeId: CUBE_ID.ICEBOX_STATIC,  pos: [0,h,0], vis: false, t100: 100 }],
    6: [ { cubeId: CUBE_ID.EVILEYE,        pos: [0,h,0], vis: true, t100: 100 }, 
         { cubeId: CUBE_ID.EVILEYE_STATIC, pos: [0,h,0], vis: false, t100: 100 }],
};


export default function CanvasRuntime() {
    const { sys, cubeControllerMap, orbitControlsRef, sliderRef, autoPlayRef,
        cookieShowFace, ceekioShowFace, levelStartEpochMS,
     } = useAppContext();
    const mainCubeId = useRef();
    
    const signalDetected = () => {
        const new_l = sys.level.ref.current;
        const new_q = sys.qcode.ref.current;
        const old_l = sys._runtime_level.current;
        const old_q = sys._runtime_qcode.current;
        return (new_l !== old_l) || (new_q !== old_q);
    }

    const _displayLevelAndQcode = () => {
        const new_l = sys.level.ref.current;
        const new_q = sys.qcode.ref.current;
        const old_l = sys._runtime_level.current;
        const old_q = sys._runtime_qcode.current;
        console.log(`_runtime: (${old_l}, ${old_q}) -> (${new_l}, ${new_q})`);
    };

    const syncLevelAndQcode = () => {
        sys._runtime_level.current = sys.level.ref.current;
        sys._runtime_qcode.current = sys.qcode.ref.current;
    };

    const hideAllCubes = () => {
        for (const [_, ctrl] of Object.entries(cubeControllerMap)) {
            ctrl.setVisible(false);
        }
    };

    const launchQuestion = (lid, qid) => {
        const questionSpec = EXPERIMENT_PROBBLEM_SET[lid][qid]; 
        if (!questionSpec) {
            console.log(`null questionSpec: ${lid}, ${qid}`);
            return;
        }
        console.log(`launchQuestion: (${lid}, ${qid})`);

        questionSpec.forEach((spec, index) => {
            const ctrl = cubeControllerMap[spec.cubeId];
            if (spec.mnetKey) {
                const mnet = ALL_MNETS[spec.mnetKey];
                ctrl.setManifestMatrix(mnet.outputMatrix);
            }
            ctrl.resetTimeParameters(spec.t100);
            ctrl.setVisible(spec?.visible);
            ctrl.setBaseId(spec.baseId);
            ctrl.rotateToPose(spec.initPose);
            ctrl.setPosition(spec?.position);
            ctrl.interactor?.setGivenLabel?.(spec?.givenLabel);

        });
    }

    const attachSlider = (lid, qid) => {
        const questionSpec = EXPERIMENT_PROBBLEM_SET[lid][qid];
        const cid = questionSpec[0].cubeId;
        mainCubeId.current = cid;
        cubeControllerMap[cid].attachSliderRef(sliderRef);
    };

    useFrame((_, delta) => { 
        const level = sys.level.ref.current;
        const qcode = sys.qcode.ref.current;

        if (signalDetected()) {
            _displayLevelAndQcode();
            const { isIntro, qid, isSolving } = parseQcode(qcode);
            console.log(isIntro, qid, isSolving);

            orbitControlsRef.current?.applyCameraRestriction(false);
            cookieShowFace.current = true;
            ceekioShowFace.current = true;

            if (level === 0) {
                orbitControlsRef.current.resetInstant();
                hideAllCubes();
                syncLevelAndQcode();
                return;
            }
            
            // set new level settings
            if (isIntro) {
                hideAllCubes();
                orbitControlsRef.current.resetInstant();
                INTRO_STATUS[level].forEach(actor => {
                    const controller = cubeControllerMap[actor.cubeId];
                    controller.reset(actor);
                });
            }
            // set new questions settings
            else if (isSolving) {
                // timer
                if (levelStartEpochMS.current === null) {
                    levelStartEpochMS.current = getEpochMS();
                }
                
                orbitControlsRef.current.resetWithAnimation();
                orbitControlsRef.current?.applyCameraRestriction(true);
                
                cookieShowFace.current = false;
                ceekioShowFace.current = false;
                const controller = cubeControllerMap[INTRO_STATUS[level][0].cubeId];
                if (level >= 2 && level <= 5) {
                    controller.interactor?.clearAllLabels?.();
                    controller.interactor?.setLock(false);
                }
                
                launchQuestion(level - 1, qid - 1);
                syncLevelAndQcode();
                return;
            }
            // set replay settings
            else {
                attachSlider(level - 1, qid - 1);
                const controller = cubeControllerMap[mainCubeId.current];
                controller.resetTimeParameters(level === 6 ? 100 : 0);

                if (level >= 2 && level <= 5) {
                    controller.interactor.setLock(true);
                }
            }
            syncLevelAndQcode();
        }

        if (sliderRef?.current) {
            if (autoPlayRef.current && autoPlayRef.current.checked) {
                
            } else {
                const controller = cubeControllerMap[mainCubeId.current];
                controller?.resetTimeParameters(Number(sliderRef.current.value));
            }
        }

        if (mainCubeId.current && autoPlayRef.current) {
            const autoPlay = autoPlayRef.current.checked;
            const controller = cubeControllerMap[mainCubeId.current];

            if (controller.isAutoPlay !== autoPlay) {
                cubeControllerMap[mainCubeId.current].setAutoPlay(autoPlay);
            }
        }
      
    });

    return null;
}