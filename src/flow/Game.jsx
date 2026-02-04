import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import ScenePort from '../layoutUI/ScenePort';
import R3FCanvas from '../scene/R3FCanvas';
import SidePanel from '../layoutUI/SidePanel';
import './Game.css';

export default function Game() {
    const { sys, weakResetSignal } = useAppContext();

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key;

            // Only respond to number keys 1–6
            if (key >= '1' && key <= '6') {
                const level = Number(key);
                sys.level.set(level);
                sys.qcode.set(0);
                weakResetSignal.current += 1;
            }
            // Left arrow
            if (key === '-' || key === '_') {
                if (sys.qcode.ref.current >= 1) {
                    sys.qcode.set(prev => prev - 1);
                }
                return;
            }
            // Right arrow
            if (key === '=' || key === '+') {
                // TODO: your right-arrow logic here
                sys.qcode.set(prev => prev + 1);
                weakResetSignal.current += 1;
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            };
    }, []);

    return (
        <section className='gameMain'>
            <ScenePort>
                <R3FCanvas />
            </ScenePort>
            <SidePanel />
        </section>
    );
}