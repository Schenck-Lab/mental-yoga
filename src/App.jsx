import { APP_STAGE } from './_experiment/constants';
import { useAppContext } from './context/AppContext';
import Topbar from './layoutUI/Topbar';
import Login from './flow/Login';
import Intro from './flow/Intro';
import Game from './flow/Game';
import Upload from './flow/Upload';
import { _render_shout_ } from './utils/utils';
import './app.css';

function App() {
    const { sys } = useAppContext();

    //_render_shout_('App', `appStage: ${sys.appStage.value}`, false);
    
    const gameStage = {
        [APP_STAGE.LOGIN]: <Login />,
        [APP_STAGE.INTRO]: <Intro />,
        [APP_STAGE.GAME]: <Game />,
        [APP_STAGE.UPLOAD]: <Upload />,
    };

    return (
        <section className='app_shell' >
            <Topbar />
            <div className='app_main' >
                {gameStage[sys.appStage.value]}
            </div>
        </section>
    );
}

export default App
