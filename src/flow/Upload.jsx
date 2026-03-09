import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { GAS_URL, ACTION } from '../_experiment/gas_config';
import { CSV_HEADER } from '../_experiment/constants';
import './Upload.css';

const UPLOAD_TIMEOUT_MS = 20000;
const VERIFY_DELAY_MS = 2000;

export default function Upload() {
    const { meta, csvMetaBufRef, csvGameBufRef } = useAppContext();

    const [taskDone, setTaskDone] = useState(false);
    const [status, setStatus] = useState('loading');
    // loading | success | error | timeout

    const fileName = useMemo(() => {
        return generateFileName(false);
        // eslint-disable-next-line
    }, []);

    function generateFileName(isDownloaded = false) {
        const pid = meta?.pid?.current || 'UNKNOWN';
        const firstName = meta?.firstName?.current || 'X';
        const lastName = meta?.lastName?.current || 'X';

        const f = String(firstName).charAt(0).toUpperCase() || 'X';
        const l = String(lastName).charAt(0).toUpperCase() || 'X';

        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');

        const suffix = isDownloaded ? '_DL.csv' : '.csv';
        return `${pid}_${f}${l}_${month}${day}_${hour}${minute}${suffix}`;
    }

    function generateCSVContent() {
        const metaLines = [
            `PID,${meta?.pid?.current || ''}`,
            `First_Name,${meta?.firstName?.current || ''}`,
            `Last_Name,${meta?.lastName?.current || ''}`,
            `Email_Address,${meta?.email?.current || ''}`,
            `Date,${new Date().toString()}`,
        ];

        // placeholder only for now
        const dataHeader = Object.keys(CSV_HEADER);
        const dataRows = csvGameBufRef.current;

        const csvParts = [
            metaLines.join('\n'),
            '---',
            dataHeader.join(','),
            dataRows.map((row) => row.join(',')).join('\n'),
        ];

        return csvParts.join('\n');
    }

    function sendCSVToDrive() {
        const csvContent = generateCSVContent();

        fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            redirect: 'follow',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                fileName,
                csvContent,
                emailAddress: meta?.email?.current || '',
            }),
        })
        .then(() => {
            console.log('Upload POST sent.');
            setTaskDone(true);
        })
        .catch((error) => {
            console.error('Upload error:', error);
            setStatus('error');
        });
    }

    function verifyCSVUpload() {
        const encodedEmail = encodeURIComponent(meta?.email?.current || '');
        const encodedFileName = encodeURIComponent(fileName);

        fetch(`${GAS_URL}?action=${ACTION.uploadVerification}&email=${encodedEmail}&fileName=${encodedFileName}`)
            .then((response) => response.json())
            .then((data) => {
                if (!data.success) {
                    console.error('Verification failed:', data.message);
                    setStatus('error');
                    return;
                }

                if (data.mentalYogaCompleted && data.fileExists) {
                    console.log('Upload verified.');
                    setStatus('success');
                    return;
                }

                console.warn('Verification incomplete.');
                setStatus('error');
            })
            .catch((error) => {
                console.error('Verification error:', error);
                setStatus('error');
            });
    }

    function downloadCSV() {
        const csvContent = generateCSVContent();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = generateFileName(true);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);
    }

    useEffect(() => {
        const timeoutTimer = setTimeout(() => {
            setStatus((prevStatus) => {
                if (prevStatus === 'loading') {
                    console.log('Upload timeout.');
                    return 'timeout';
                }
                return prevStatus;
            });
        }, UPLOAD_TIMEOUT_MS);

        return () => {
            clearTimeout(timeoutTimer);
        };
    }, []);

    useEffect(() => {
        if (!taskDone) {
            sendCSVToDrive();
            return;
        }

        const verifyTimer = setTimeout(() => {
            verifyCSVUpload();
        }, VERIFY_DELAY_MS);

        return () => {
            clearTimeout(verifyTimer);
        };
        // eslint-disable-next-line
    }, [taskDone]);

    const title = 'Uploading Data';

    const subtitle =
        status === 'success'
            ? 'Your data has been uploaded successfully. You may now close the page. Thank you for participating.'
            : 'All questions have been completed. Your data is now being uploaded.';

    return (
        <section className='uploadPage'>
            <div className='uploadPage__backdrop' />

            <div className='uploadCard'>
                <div className='uploadCard__header'>
                    <div className='uploadCard__eyebrow'>UPLOAD</div>
                    <h1 className='uploadCard__title'>
                        {status === 'success' ? 'Upload Complete' : title}
                    </h1>
                    <p className='uploadCard__subtitle'>{subtitle}</p>
                </div>

                {(status === 'timeout' || status === 'error') && (
                    <div className='uploadCard__alert uploadCard__alert--warn'>
                        Network is busy. Please manually download the CSV file and send it to the research assistant.
                    </div>
                )}

                <div className='uploadCard__actions'>
                    {status === 'loading' && (
                        <button
                            className='uploadCard__button'
                            type='button'
                            disabled
                        >
                            Uploading...
                        </button>
                    )}

                    {status === 'success' && (
                        <button
                            className='uploadCard__button'
                            type='button'
                            onClick={() => window.close()}
                        >
                            Close Page
                        </button>
                    )}

                    {(status === 'timeout' || status === 'error') && (
                        <button
                            className='uploadCard__button'
                            type='button'
                            onClick={downloadCSV}
                        >
                            Download CSV Data
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}