// src/layoutUI/ScenePort.jsx
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { LEVEL_COPY } from '../_experiment/levelText';
import { PiVideoCameraFill } from 'react-icons/pi';
import { parseQcode } from '../utils/utils';
import './ScenePort.css';

function HintBadge({ jsx, speaker }) {
    const [open, setOpen] = useState(false);

    const hasHint = jsx;
    const label = hasHint ? 'Hint' : 'No Hint';

    const openHint = () => {
        if (!hasHint) return;
        setOpen(true);
    };

    const closeHint = () => {
        setOpen(false);
    };

    const hintButton = (
        <button
            type='button'
            className={`scenePort__badge ${hasHint ? '' : 'scenePort__badge--disabled'}`}
            aria-haspopup='dialog'
            aria-expanded={open}
        >
            {label}
        </button>
    );

    const popover = (
        <div className='scenePort__popover' role='dialog' aria-label='Hint'>
            <div className='scenePort__popoverTitle'>{speaker}</div>
            <div className='scenePort__popoverBody'>{jsx}</div>
        </div>
    );

    return (
        <div className='scenePort__hintWrap' onMouseEnter={openHint} onMouseLeave={closeHint}>
            {hintButton}
            {open && popover}
        </div>
    );
}

function ResetCameraButton() {
    const { orbitControlsRef } = useAppContext();

    return (
        <div className='scenePort__camWrap'>
            <button
                type='button'
                className='scenePort__camBtn'
                onClick={() => orbitControlsRef.current?.resetWithAnimation?.()}
                aria-label='Reset camera'
                title='Reset camera'
            >
                <PiVideoCameraFill className='scenePort__camIcon' />
                <span>Reset Camera</span>
            </button>
        </div>
    );
}



export default function ScenePort({ children }) {
    const { sys } = useAppContext();
    const { isIntro } = parseQcode(sys.qcode.ref.current);
    const levelId = sys.level.ref.current;

    const level = LEVEL_COPY[levelId];
    const title = `Level ${levelId} · ${level.title}`;
    const speaker = levelId == 6 ? '...' : 'Iris:';
    
    const placeHolder = (
        <div className='scenePort__placeholder'>
            <div className='scenePort__placeholderText'>Loading...</div>
        </div>
    );

    return (
        <section className='scenePort'>
            <header className='scenePort__header'>
                <div className='scenePort__title'>{title}</div>
                <div className='scenePort__tag'>Character: {level.name}</div>
            </header>

            <div className='scenePort__body'>
                {(!isIntro) && <HintBadge jsx={level.hint} speaker={speaker} />}
                <ResetCameraButton />
                {children ?? placeHolder}
            </div>
        </section>
    );
}
