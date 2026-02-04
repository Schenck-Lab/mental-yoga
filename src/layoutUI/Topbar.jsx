import { APP_STAGE } from '../_experiment/constants';
import { useAppContext } from '../context/AppContext';
import './Topbar.css';

function StatusPill({ label, value }) {
    return (
        <div className='statusPill'>
            <span className='statusPill__label'>{label}</span>
            <span className='statusPill__value'>{value}</span>
        </div>
    );
}

export default function Topbar() {
    const { meta, sys } = useAppContext();
    const user = (sys.appStage.value == APP_STAGE.LOGIN) 
        ? ('not signed in') : (meta.email.current);

    const logo = (
        <div className='topbar__brand'>
            <img
                className='topbar__logo'
                src='/cube_icon.png'
                alt='Mental Yoga logo'
            />
            <div className='topbar__title'>
                <div className='topbar__name'>Mental Yoga</div>
            </div>
        </div>
    );

    const userPill = (
        <div className='topbar__status'>
            <StatusPill label='Participant' value={user} />
        </div>
    );

    return (
        <section className='topbar'>
            {logo}
            {userPill}
        </section>
    );
}
