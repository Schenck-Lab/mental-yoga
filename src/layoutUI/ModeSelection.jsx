// app/src/ui/ModeSelection.jsx
import { useState, useEffect } from 'react';
import { ANIMATION_MODE } from '../cubenet/cubeThreeModel';
import { useAppContext } from '../context/AppContext';
import { LEVEL_ACTIVE_CUBEID_MAP } from '../scene/config';
import { preventArrowKeyDefault, capitalize } from '../utils/utils';
import './ModeSelection.css';


function RadioOption({ value, checked, onChange }) {
    return (
        <label className='modeSelection__option'>
            <input
                type='radio'
                name='animationMode'
                value={value}
                checked={checked}
                onChange={onChange}
                style={{cursor: 'pointer'}}
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
    const { sys, cubeControllerMap } = useAppContext();
    const [animMode, setAnimMode] = useState(ANIMATION_MODE.BLOSSOM);
    
    const levelId = sys.level.value;
    const controller = cubeControllerMap[LEVEL_ACTIVE_CUBEID_MAP[levelId]];

    useEffect(() => {
        controller.setAnimationMode(ANIMATION_MODE.BLOSSOM);
    }, []);
    
    useEffect(() => {
        const resetFlag = (sys.qcode.value & 1) === 1;
        if (resetFlag) setAnimMode(ANIMATION_MODE.BLOSSOM);
    }, [sys.qcode.value]);

    function handleChange(e) {
        const value = e.target.value;
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
                    />
                ))}
            </fieldset>
        </section>
    );
}
