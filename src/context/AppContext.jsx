import { createContext, useContext, useRef, useState } from 'react';
import { APP_STAGE } from '../_experiment/constants.js';
import { useSignal } from '../hooks/useSignal.jsx';
import { CUBE_ID } from '../scene/cubeCharacters.js';
import CubeController from '../cubenet/CubeController.js';
import { _render_shout_ } from '../utils/utils.js';
const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);


export const AppContextProvider = ({ children }) => {
    _render_shout_('AppContextProvider', '', true);

    // meta data
    const pid = useRef('?000');
    const firstName = useRef('user_fname');
    const lastName = useRef('user_lname');
    const email = useRef('user@example.com');

    // controls refs
    const orbitControlsRef = useRef();
    
    // game status
    const appStage = useSignal(APP_STAGE.GAME);
    const level = useSignal(6);
    const qcode = useSignal(0);

    // signals
    const [answerSignal, setAnswerSignal] = useState(false);
    const weakResetSignal = useRef(0);

    // cube character controller map
    const cubeControllerMapRef = useRef(null);

    if (!cubeControllerMapRef.current) {
        cubeControllerMapRef.current = Object.fromEntries(
            Object.values(CUBE_ID).map((id) => [id, new CubeController(id)])
        );
    }
    const cubeControllerMap = cubeControllerMapRef.current;

    
    //

    const value = {
        meta: { pid, firstName, lastName, email },
        sys: { appStage, level, qcode },
        orbitControlsRef,
        cubeControllerMap,
        answerSignal, setAnswerSignal, weakResetSignal,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};