import { useState } from 'react';
import { LEVEL_COPY } from '../_experiment/levelText';
import { LEVEL_ACTIVE_CUBEID_MAP } from '../scene/config';
import { useAppContext } from '../context/AppContext';
import RotationControls from './tempUI/RotationControls';
import CookieSelector from './tempUI/CookieSelector';
import ModeSelection from './ModeSelection';
import PlayerSlider from './PlayerSlider';
import { parseQcode } from '../utils/utils';
import './SidePanel.css';

function LevelIntro() {
    const { sys, setAnswerSignal, weakResetSignal } = useAppContext();
    const levelId = sys.level.value;
    const level = LEVEL_COPY[levelId];

    const onClick = () => {
        sys.qcode.set(prev => prev + 1);
        setAnswerSignal(false);
        weakResetSignal.current += 1;
    };

    const enterLevelButton = (
        <button 
            className='btn btn--enterLevel' 
            type='button'
            onClick={onClick}
        >
            Enter Level
        </button>
    );

    return (
        <section className='levelIntroPanel'>
            <header className='levelIntroPanel__header'>
                <div className='levelIntroPanel__title'>Introduction</div>
            </header>

            <div className='levelIntroPanel__body'>
                <div>{level.intro}</div>
                <div className='levelIntroPanel__sep' />
            </div>

            {enterLevelButton}
        </section>
    );
}


function AnswerPanel({ disabled }) {
    const { sys, answerSignal } = useAppContext();
    const levelId = sys.level.value;
    const level = LEVEL_COPY[levelId];
    const { isIntro, qid } = parseQcode(sys.qcode.ref.current);
    const cs_key = `${levelId}${qid}`;

    const questionText = (
        <p className='answerPanel__text'>
            {level.questionOneLiner}
        </p>
    );
    
    const onClick = () => {
        sys.qcode.set(prev => prev + 1);
    };

    const confirmButton = (
        <button
            className='btn btn--confirm'
            type='button'
            disabled={!answerSignal || false}
            onClick={onClick}
        >
            Confirm Answer
        </button>
    );

    return (
        <section
            className={`answerPanel panelCard ${disabled ? 'isDisabled' : ''}`}
            data-disabled={disabled ? 'true' : 'false'}
        >
            <header className='answerPanel__header'>
                <div className='answerPanel__title'>Question {qid}</div>
            </header>

            <div className='answerPanel__body'>
                {questionText}
                <div className='answerPanel__sep' />
                {levelId == 1 && !isIntro && <CookieSelector key={cs_key} />}
                {levelId == 6 && !isIntro && <RotationControls />}
            </div>

            {confirmButton}
        </section>
    );
}

function ReviewPanel({ disabled }) {
    const { sys, setAnswerSignal, weakResetSignal, cubeControllerMap } = useAppContext();

    const levelId = sys.level.value;
    const controller = cubeControllerMap[LEVEL_ACTIVE_CUBEID_MAP[levelId]];

    const onClick = () => {
        sys.qcode.set(prev => prev + 1);
        setAnswerSignal(false);
        weakResetSignal.current += 1;

        if (levelId === 6) {
            controller.resetToCubeLocked();
        }
        else {
            controller.resetToNetLocked();
        }
    };

    const nextButton = (
        <button 
            className='btn btn--next' 
            type='button'
            onClick={onClick}
        >
            Next Question
        </button>
    );

    return (
        <section
            className={`reviewPanel panelCard ${disabled ? 'isDisabled' : ''}`}
            data-disabled={disabled ? 'true' : 'false'}
            aria-disabled={disabled ? 'true' : 'false'}
        >
            <header className='reviewPanel__header'>
                <div className='reviewPanel__title'>Replay</div>
            </header>

            <ModeSelection />
            <PlayerSlider />
            {nextButton}
        </section>
    );
}

export default function SidePanel() {
    const { sys } = useAppContext();
    const { isIntro, isSolving } = parseQcode(sys.qcode.ref.current);

    const funcPanel = (
        <section className='sidePanel'>
            <AnswerPanel disabled={!isSolving} />
            <ReviewPanel disabled={ isSolving} />
        </section>
    );

    return (isIntro ? <LevelIntro /> : funcPanel);
}
