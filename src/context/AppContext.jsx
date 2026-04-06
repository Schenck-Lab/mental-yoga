import { createContext, useContext, useRef, useState, useMemo } from 'react';
import { APP_STAGE } from '../_experiment/constants.js';
import { useSignal } from '../hooks/useSignal.jsx';
import { CUBE_ID } from '../scene/cubeCharacters.js';
import CubeController from '../cubenet/CubeController.js';
import NonCubeController from '../cubenet/NonCubeController.js';
import { _render_shout_, getEpochMS, toTimeCT, parseQcode } from '../utils/utils.js';
const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);


export const AppContextProvider = ({ children }) => {
    _render_shout_('AppContextProvider', '', true);

    // meta data
    const pid = useRef('no_data');
    const firstName = useRef('no_data');
    const lastName = useRef('no_data');
    const email = useRef('no_data');
    const loginTime = useRef('no_data');
    // const summary = useRef({
    //     1: ['_','_','_','_','_','_','_','_'], 
    //     2: ['_','_','_','_','_','_','_','_'], 
    //     3: ['_','_','_','_','_','_','_','_'], 
    //     4: ['_','_','_','_','_','_','_','_'], 
    //     5: ['_','_','_','_','_','_','_','_'], 
    //     6: ['_','_','_','_','_','_','_','_'], 
    // });

    // CSV Buffers
    const csvMetaBufRef = useRef([]);  // Buffer for metadata
    const csvGameBufRef = useRef([]);  // Buffer for game data
    const addMetaData = (key, value) => {
        csvMetaBufRef.current.push(`# ${key}: ${value}`);
    };

    const addGameData = (sys, clickObj, answer='n/a') => {
        const ts = getEpochMS();
        const timeCT = toTimeCT(ts);
        const level = sys.level.ref.current;
        const objQ = parseQcode(sys.qcode.ref.current);
        const qid = objQ.qid;
        const q_stage = objQ.isIntro ? 'Intro' : (objQ.isSolving ? 'Solving' : 'Replaying');
        csvGameBufRef.current.push([
            ts, timeCT, level, qid, q_stage, clickObj, answer
        ]);
    };

    // controls refs
    const orbitControlsRef = useRef();
    const isCameraRestricted = useRef(false);
    const sliderRef = useRef();
    const autoPlayRef = useRef();
    
    // game status
    const appStage = useSignal(APP_STAGE.LOGIN);
    const level = useSignal(1);
    const qcode = useSignal(0);
    const _runtime_level = useRef(-1);
    const _runtime_qcode = useRef(-1);

    // timer
    const levelStartEpochMS = useRef(null);

    //
    const cookieShowFace = useRef(true);
    const ceekioShowFace = useRef(true);

    // cube character controller map
    const cubeControllerMapRef = useRef(null);

    if (!cubeControllerMapRef.current) {
        cubeControllerMapRef.current = Object.fromEntries(
            Object.values(CUBE_ID).map((id) => (id === CUBE_ID.CEEKIO ?
                [id, new NonCubeController()] : [id, new CubeController(id)])
            )
        );
    }
    const cubeControllerMap = cubeControllerMapRef.current;

    const value = {
        meta: { pid, firstName, lastName, email, loginTime },
        sys: { appStage, level, qcode, _runtime_level, _runtime_qcode },
        orbitControlsRef, isCameraRestricted, sliderRef, autoPlayRef,
        cubeControllerMap, levelStartEpochMS,
        cookieShowFace, ceekioShowFace,
        csvMetaBufRef, csvGameBufRef, addMetaData, addGameData,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};