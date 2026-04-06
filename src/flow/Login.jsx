import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { APP_STAGE } from '../_experiment/constants';
import { GAS_URL, ACTION } from '../_experiment/gas_config';
import { getEpochMS, toTimeCT } from '../utils/utils';
import './Login.css';

const VERSION = '2026 SPRING';

export default function Login() {
    const { sys, meta } = useAppContext();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');
    const [warnMsg, setWarnMsg] = useState('');

    const formReady = email.trim() !== '' && !loading;

    const isValidEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    };

    const normalizeCompleted = (value) => {
        if (value === true) return true;
        if (value === false) return false;

        if (typeof value === 'string') {
            const s = value.trim().toLowerCase();
            return s === 'true';
        }

        return false;
    };

    const goToIntro = () => {
        sys.appStage.set(APP_STAGE.INTRO);
    };

    const clearMessages = () => {
        setErrorMsg('');
        setWarnMsg('');
    };

    const handleVerifyParticipant = async () => {
        clearMessages();

        const cleanEmail = email.trim();

        if (!isValidEmail(cleanEmail)) {
            setErrorMsg('Please enter a valid registered email address.');
            return;
        }

        setLoading(true);

        try {
            const encodedEmail = encodeURIComponent(cleanEmail);
            const url = `${GAS_URL}?action=${ACTION.loginVerification}&email=${encodedEmail}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!data.success) {
                setErrorMsg(
                    'This email was not found in the participant database. Please re-enter a valid registered email.'
                );
                return;
            }

            const completed = normalizeCompleted(data.mentalYogaCompleted);

            if (completed) {
                setWarnMsg('This participant has already completed the Mental Yoga study.');
                return;
            }

            // update meta
            meta.pid.current = data.pid;
            meta.firstName.current = data.firstName;
            meta.lastName.current = data.lastName;
            meta.email.current = cleanEmail;
            meta.loginTime.current = getEpochMS();

            console.log(`Login: ${toTimeCT(meta.loginTime.current)} (Central Time)`);
            //console.log(meta);

            goToIntro();
        } catch (err) {
            console.error('Login verification error:', err);
            setErrorMsg('Something went wrong while verifying your email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='loginPage'>
            <div className='loginPage__backdrop' />

            <div className='loginCard'>
                <div className='loginCard__header'>
                    <div className='loginCard__eyebrow'>{VERSION}</div>
                    <h1 className='loginCard__title'>Welcome to Mental Yoga</h1>
                </div>

                <div className='loginCard__form'>
                    <label className='loginField'>
                        <span className='loginField__label'>Registered Email</span>
                        <input
                            className='loginField__input'
                            type='email'
                            placeholder='Enter your registered email'
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearMessages();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && formReady) {
                                    handleVerifyParticipant();
                                }
                            }}
                            disabled={loading}
                        />
                    </label>

                    {!!errorMsg && (
                        <div className='loginCard__alert loginCard__alert--error'>
                            {errorMsg}
                        </div>
                    )}

                    {!!warnMsg && (
                        <div className='loginCard__alert loginCard__alert--warn'>
                            {warnMsg}
                        </div>
                    )}

                    <button
                        className='loginCard__button'
                        type='button'
                        disabled={!formReady}
                        onClick={handleVerifyParticipant}
                    >
                        {loading ? 'Verifying...' : 'Verify Participant'}
                    </button>
                </div>
            </div>
        </section>
    );
}