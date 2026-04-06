import { LEVEL_COPY } from '../_experiment/levelText';
import { APP_STAGE } from '../_experiment/constants';
import { EXPERIMENT_PROBBLEM_SET } from '../_experiment/questionLibrary';
import { useAppContext } from '../context/AppContext';
import RotationControls from './tempUI/RotationControls';
import CookieSelector from './tempUI/CookieSelector';
import ModeSelection from './ModeSelection';
import PlayerSlider from './PlayerSlider';
import { LEVEL_TIME_LIMIT_SEC } from '../_experiment/constants';
import { parseQcode, getEpochMS, diffSeconds, _render_shout_ } from '../utils/utils';
import './SidePanel.css';


function LevelIntro() {
    _render_shout_('LevelIntro');

    const { sys, addGameData } = useAppContext();
    const levelId = sys.level.value;
    const level = LEVEL_COPY[levelId];
    
    const onClick = () => {
        sys.qcode.set(prev => prev + 1);
        addGameData(sys, 'Enter Level');
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
    const { sys, addGameData } = useAppContext();
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
        addGameData(sys, 'Confirm Answer');
    };

    const confirmButton = (
        <button
            className='btn btn--confirm'
            type='button'
            disabled={false}
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
    const { sys, levelStartEpochMS, addGameData, autoPlayRef } = useAppContext();

    // 'Next Question' button
    const onClick = () => {
        const levelId = sys.level.value;
        const { qid } = parseQcode(sys.qcode.value);
        
        // level time check
        const ts = getEpochMS();
        const diff = diffSeconds(levelStartEpochMS.current, ts);
        const exceedTimeLimit = (diff >= LEVEL_TIME_LIMIT_SEC[levelId - 1]);
        const noQuestionInCurrentLevel = (qid === EXPERIMENT_PROBBLEM_SET[levelId - 1].length);

        addGameData(sys, 'Next Question');
        
        // to next question or level within time limit
        if (exceedTimeLimit || noQuestionInCurrentLevel) {
            levelStartEpochMS.current = null; // reset timer

            if (levelId === 6) {
                sys.appStage.set(APP_STAGE.UPLOAD);
                return;
            }
            sys.level.set(prev => prev + 1);
            sys.qcode.set(0);
        } else {
            sys.qcode.set(prev => prev + 1);
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
