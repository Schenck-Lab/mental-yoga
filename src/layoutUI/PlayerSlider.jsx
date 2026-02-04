// app/src/ui/PlayerSlider.jsx
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { preventArrowKeyDefault } from '../utils/utils';
import { LEVEL_ACTIVE_CUBEID_MAP } from '../scene/config';
import { _render_shout_ } from '../utils/utils';
import './PlayerSlider.css';

export default function PlayerSlider() {
    _render_shout_('PLayerSlider');

    const { sys, cubeControllerMap } = useAppContext();
    const [autoPlay, setAutoPlay] = useState(false);
    const sliderRef = useRef();

    const levelId = sys.level.value;
    const activeCubeId = LEVEL_ACTIVE_CUBEID_MAP[levelId];
    const controller = cubeControllerMap[activeCubeId];

    // Attach event listener to the raw JS slider
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        controller.attachSliderRef(sliderRef);

        const handleInput = (e) => {
            const value = Number(e.target.value);
            controller.t100 = value;
        };

        slider.addEventListener('input', handleInput);
        return () => {
            slider.removeEventListener('input', handleInput);
        };
    // eslint-disable-next-line
    }, []);


    useEffect(() => {
        const resetFlag = (sys.qcode.value & 1) === 1;
        if (!resetFlag) return;

        // reset autoplay-checkbox and slider UI
        setAutoPlay(false);
        if (sliderRef.current) {
            sliderRef.current.value = 100;
        }
    }, [sys.qcode.value]);

    
    const sepAndLabel = (
        <div className='playerSlider__sep' >
            <span className='playerSlider__sepText'>Player Controls</span>
        </div>
    );

    const handleCheckBox = (e) => {
        const checked = e.target.checked;
        setAutoPlay(checked);
        controller.setAutoPlay(checked);
    };

    const checkBox = (
        <label className='playerSlider__check'>
            <input
                type='checkbox'
                checked={autoPlay}
                onChange={handleCheckBox}
                style={{cursor: 'pointer'}}
            />
            <span className='playerSlider__checkText'>Auto Play</span>
        </label>
    );

    const slider = (
        <input
            ref={sliderRef}
            className='playerSlider__range'
            type='range'
            min='0'
            max='100'
            step='1'
            defaultValue={100}
            disabled={autoPlay}
            onKeyDown={preventArrowKeyDefault}
        />
    );

    const cubeNetLabel = (
        <div className='playerSlider__ends'>
            <span className='playerSlider__end'>NET</span>
            <span className='playerSlider__end'>CUBE</span>
        </div>
    );

    return (
        <section className='playerSlider' >
            {sepAndLabel}
            <div className='playerSlider__card'>
                {checkBox}
                {slider}
                {cubeNetLabel}
            </div>
        </section>
    );
}
