import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { CUBE_ID } from '../../scene/cubeCharacters';
import { CUBE_ORIENTATION_MAP } from '../../cubenet/cubeSpec';
import { _render_shout_ } from '../../utils/utils';
import './RotationControls.css';

export default function RotationControls() {
    _render_shout_('RotationControls');

    const { sys, addGameData, cubeControllerMap } = useAppContext();
    const controller = cubeControllerMap[CUBE_ID.EVILEYE];
    const [disableReset, setDisableReset] = useState(true);

    const buttons = [
        { id: 'COUNTERCLOCKWISE', op: 'zp', label: '↺', type: 'rotBtn' },
        { id: 'UP', op: 'xn', label: '↑', type: 'rotBtn' },
        { id: 'CLOCKWISE', op: 'zn',label: '↻', type: 'rotBtn' },
        { id: 'RANDOM', label: 'Random', type: 'fnBtn' },

        { id: 'LEFT', op: 'yn', label: '←', type: 'rotBtn' },
        { id: 'DOWN', op: 'xp', label: '↓', type: 'rotBtn' },
        { id: 'RIGHT', op: 'yp', label: '→', type: 'rotBtn' },
        { id: 'RESET', label: 'Reset', type: 'fnBtn' },
    ];

    function handleRotationClick(button) {
        
        if (button.type === 'rotBtn') {
            controller.rotateStep(button.op);
            setDisableReset(controller.nextPose === 'TF');

            addGameData(sys, button.id, controller.nextPose);
            return;
        }

        if (button.label === 'Reset') {
            controller.rotateToPose('TF');
            setDisableReset(true);
            addGameData(sys, 'RESET', 'TF');
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
        addGameData(sys, 'RANDOM', nextPose);
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
