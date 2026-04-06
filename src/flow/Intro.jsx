import { useAppContext } from '../context/AppContext';
import { APP_STAGE } from '../_experiment/constants';
import './intro.css';

export default function Intro() {
    const { sys } = useAppContext();
    const backgroundImage = '/mental_yoga_theme.png';

    const onStart = () => {
        sys.appStage.set(APP_STAGE.GAME);
    };

    return (
        <div className="intro-page">
            {/* Background */}
            <div
                className="intro-background"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="intro-overlay" />

            {/* Content */}
            <div className="intro-content">
                <div className="intro-card">
                    <h1 className="intro-title">Welcome to Mental Yoga</h1>

                    {/* Story */}
                    <div className="intro-section">
                        <h2 className="intro-section-title">Story</h2>
                        <p className="intro-paragraph">
                            In this playful world, cube-like creatures gather in a quiet yoga studio to stretch,
                            balance, and challenge their minds. Some of them may need your help, while others
                            have prepared a few friendly challenges to welcome you. Are you ready to begin your journey?
                        </p>
                    </div>

                    {/* Instructions */}
                    <div className="intro-section">
                        <h2 className="intro-section-title">Before you begin</h2>

                        <p className="intro-paragraph">
                            If you have any questions, you may ask the researcher at any time, both now and during the activity.
                            The session will take about 30 minutes. You will complete 6 levels, each lasting around 5 minutes.
                            In each level, you will explore a set of problems at your own pace. When time is up,
                            you will automatically move on to the next level.
                            Please stay engaged, do your best, and enjoy the experience. Good luck!
                        </p>
                    </div>

                    {/* Button */}
                    <div className="intro-footer">
                        <button className="intro-button" onClick={onStart}>
                            Start The Game
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}