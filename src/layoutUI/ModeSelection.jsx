

// app/src/ui/ModeSelection.jsx
import { useState, useEffect } from 'react';
import { ANIMATION_MODE } from '../cubenet/cubeThreeModel';
import { useAppContext } from '../context/AppContext';
import { LEVEL_ACTIVE_CUBEID_MAP } from '../scene/config';
import { EXPERIMENT_PROBBLEM_SET } from '../_experiment/questionLibrary';
import { preventArrowKeyDefault, capitalize, parseQcode } from '../utils/utils';
import './ModeSelection.css';
import { CUBE_ID } from '../scene/cubeCharacters';


const LEVEL_DEFAULT_MODE = {
    1: ANIMATION_MODE.BLOSSOM,
    2: ANIMATION_MODE.BLOSSOM,
    3: ANIMATION_MODE.ROLLING,
    4: ANIMATION_MODE.ROLLING,
    5: ANIMATION_MODE.ROLLING,
    6: ANIMATION_MODE.BLOSSOM,
};


function RadioOption({ value, checked, onChange, disabled = false }) {
    return (
        <label className='modeSelection__option'>
            <input
                type='radio'
                name='animationMode'
                value={value}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                onKeyDown={preventArrowKeyDefault}
            />
            <span className='modeSelection__label'>{capitalize(value)}</span>
        </label>
    );
}


/**
 * ModeSelection
 */
export default function ModeSelection() {
    const { sys, cubeControllerMap, addGameData } = useAppContext();
    const [animMode, setAnimMode] = useState(ANIMATION_MODE.BLOSSOM);

    // controlled disabled state for each mode
    const [disabledMap, setDisabledMap] = useState({
        [ANIMATION_MODE.WAVING]: false,
        [ANIMATION_MODE.ROLLING]: false,
        [ANIMATION_MODE.BLOSSOM]: false,
    });

    const levelId = sys.level.value;
    const controller = cubeControllerMap[LEVEL_ACTIVE_CUBEID_MAP[levelId]];

    useEffect(() => {
        const resetFlag = (sys.qcode.value & 1) === 1;
        if (resetFlag) setAnimMode(ANIMATION_MODE.BLOSSOM);

        const level = sys.level.value;
        const { isIntro, qid, isSolving } = parseQcode(sys.qcode.value);
        // lv and qid are 1-based

        if (!isSolving) return;

        // Handle Ceekio cube has only BLOSSOM animation mode
        const LEVEL_1 = EXPERIMENT_PROBBLEM_SET[0];
        if (level === 1 && LEVEL_1[qid - 1][0].cubeId === CUBE_ID.CEEKIO) {
            setDisabledMap({
                [ANIMATION_MODE.WAVING]: true,
                [ANIMATION_MODE.ROLLING]: true,
                [ANIMATION_MODE.BLOSSOM]: false,
            });
        } else {
            setDisabledMap({
                [ANIMATION_MODE.WAVING]: false,
                [ANIMATION_MODE.ROLLING]: false,
                [ANIMATION_MODE.BLOSSOM]: false,
            });
        }

        // Set initial mode for each level
        setAnimMode(LEVEL_DEFAULT_MODE[level]);
        controller.setAnimationMode(LEVEL_DEFAULT_MODE[level]);

    }, [sys.qcode.value]);

    function handleChange(e) {
        const value = e.target.value;

        if (disabledMap[value]) return;

        addGameData(sys, value);

        setAnimMode(value);
        controller.setAnimationMode(value);
    }

    return (
        <section className='modeSelection' aria-label='Animation Mode'>
            {/* Separator and title */}
            <div className='modeSelection__sep' role='separator'>
                <span className='modeSelection__sepText'>Animation Mode</span>
            </div>

            {/* Radio options */}
            <fieldset className='modeSelection__group'>
                {Object.values(ANIMATION_MODE).map((type) => (
                    <RadioOption
                        key={type}
                        value={type}
                        checked={animMode === type}
                        onChange={handleChange}
                        disabled={disabledMap[type]}
                    />
                ))}
            </fieldset>
        </section>
    );
}