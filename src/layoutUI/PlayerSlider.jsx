// app/src/ui/PlayerSlider.jsx
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { preventArrowKeyDefault } from '../utils/utils';
import { _render_shout_ } from '../utils/utils';
import './PlayerSlider.css';

export default function PlayerSlider() {
    _render_shout_('PLayerSlider');

    const { sliderRef, autoPlayRef, sys, addGameData } = useAppContext();
    const [autoPlay, setAutoPlay] = useState(false);
    
    useEffect(() => {
        setAutoPlay(false);
    }, [sys.qcode.value]);


    const sepAndLabel = (
        <div className='playerSlider__sep' >
            <span className='playerSlider__sepText'>Player Controls</span>
        </div>
    );

    const handleCheckBox = (e) => {
        const checked = e.target.checked;
        addGameData(sys, `autoplay_${checked}`);
        setAutoPlay(checked);
    };

    const checkBox = (
        <label className='playerSlider__check'>
            <input
                type='checkbox'
                ref={autoPlayRef}
                checked={autoPlay}
                onChange={handleCheckBox}
                style={{cursor: 'pointer'}}
            />
            <span className='playerSlider__checkText'>Auto Play</span>
        </label>
    );

    const handleMouseDown = (e) => {
        const startValue = Number(e.target.value);
        addGameData(sys, `slider_${startValue}`);
    };

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
            onMouseDown={handleMouseDown}
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
