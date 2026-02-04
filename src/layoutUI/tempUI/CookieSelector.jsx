import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { preventArrowKeyDefault } from '../../utils/utils';
import './CookieSelector.css';

function RadioOption({ value, checked, onChange }) {
    
    return (
        <label className={`radioOption ${checked ? 'isChecked' : ''}`}>
            <input
                className='radioOption__input'
                type='radio'
                name='cookieSelector'
                value={value}
                checked={checked}
                onChange={onChange}
                onKeyDown={preventArrowKeyDefault}
            />
            <span className='radioOption__circle' aria-hidden='true' />
            <span className='radioOption__label'>{value}</span>
        </label>
    );
}

export default function CookieSelector() {
    const { sys, setAnswerSignal } = useAppContext();
    const [localValue, setLocalValue] = useState();
    
    // Reset Selector at the beginning of each Question
    useEffect(() => {
        const resetFlag = (sys.qcode.value & 1) === 1;
        if (resetFlag) setLocalValue('');
    }, [sys.qcode.value]);

    const handleChange = (nextValue) => {
        setLocalValue(nextValue);
        setAnswerSignal(true);
    };

    return (
        <section className='panelCard cookieSelector'>
            <div className='panelCard__header'>
                <div className='panelCard__title'>Selection</div>
            </div>

            <div className='panelCard__body'>
                <fieldset 
                    className='cookieSelector__group' 
                    role='radiogroup' 
                    aria-label='Cookie or Ceekio'
                >
                    {['Cookie', 'Ceekio'].map((option) => (
                        <RadioOption
                            key={option}
                            value={option}
                            checked={localValue === option}
                            onChange={() => handleChange(option)}
                        />
                    ))}
                </fieldset>
            </div>
        </section>
    );
}
