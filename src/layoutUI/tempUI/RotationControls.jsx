import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { CUBE_ID } from '../../scene/cubeCharacters';
import { CUBE_ORIENTATION_MAP } from '../../cubenet/cubeSpec';
import { _render_shout_ } from '../../utils/utils';
import './RotationControls.css';

export default function RotationControls() {
    _render_shout_('RotationControls');

    const { sys, answerSignal, setAnswerSignal, cubeControllerMap } = useAppContext();
    const controller = cubeControllerMap[CUBE_ID.EVILEYE];
    const [disableReset, setDisableReset] = useState(true);

    useEffect(() => {
        const isOdds = ((sys.qcode.value & 1) == 1);
        if (!answerSignal && isOdds)
            setDisableReset(true);

    }, [sys.qcode.value]);

    const buttons = [
        { id: 'ccw', op: 'zp', label: '↺', type: 'rotBtn' },
        { id: 'up', op: 'xn', label: '↑', type: 'rotBtn' },
        { id: 'cw', op: 'zn',label: '↻', type: 'rotBtn' },
        { id: 'random', label: 'Random', type: 'fnBtn' },

        { id: 'left', op: 'yn', label: '←', type: 'rotBtn' },
        { id: 'down', op: 'xp', label: '↓', type: 'rotBtn' },
        { id: 'right', op: 'yp', label: '→', type: 'rotBtn' },
        { id: 'reset', label: 'Reset', type: 'fnBtn' },
    ];

    function handleRotationClick(button) {
        if (button.type === 'rotBtn') {
            setAnswerSignal(true);

            controller.rotateStep(button.op);
            setDisableReset(controller.nextPose === 'TF');
            return;
        }

        if (button.label === 'Reset') {
            controller.rotateToPose('TF');
            setDisableReset(true);
            return;
        }

        // Random rotation
        const currPose = controller.nextPose;
        let nextPose = currPose;

        while (nextPose === currPose) {
            const randNum = Math.floor(Math.random() * 24);
            nextPose = Object.keys(CUBE_ORIENTATION_MAP)[randNum];
        }

        controller.rotateToPose(nextPose);
        setDisableReset(nextPose === 'TF');
    }

    return (
        <section className='panelCard rotPanel'>
            <div className='panelCard__header'>
                <div className='panelCard__title'>Rotation Controls</div>
            </div>

            <div className='panelCard__body'>
                <div className='rotGrid' role='group' >
                    {buttons.map((b) => (
                        <button
                            key={b.id}
                            className={b.type}
                            type='button'
                            disabled={b.label === 'Reset' && disableReset}
                            onClick={() => handleRotationClick(b)}
                        >
                            {b.label}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
