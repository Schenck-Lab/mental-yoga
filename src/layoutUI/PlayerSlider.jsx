// app/src/ui/PlayerSlider.jsx
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { preventArrowKeyDefault } from '../utils/utils';
import { _render_shout_ } from '../utils/utils';
import './PlayerSlider.css';

export default function PlayerSlider() {
    _render_shout_('PLayerSlider');

    const { sliderRef, autoPlayRef } = useAppContext();
    const [autoPlay, setAutoPlay] = useState(false);
    
    const sepAndLabel = (
        <div className='playerSlider__sep' >
            <span className='playerSlider__sepText'>Player Controls</span>
        </div>
    );

    const handleCheckBox = (e) => {
        const checked = e.target.checked;
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
