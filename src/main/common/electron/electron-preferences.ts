
import { systemPreferences } from 'electron';

export const hasScreenPremise = () => systemPreferences.getMediaAccessStatus('screen') === 'granted';
// const requestScreenRecordingPermission = async () => {
//     if (process.platform === 'darwin') {
//         const hasPermission = systemPreferences.getMediaAccessStatus('screen') === 'granted';
//         // if (!hasPermission) {
//         //     const granted = await systemPreferences.askForMediaAccess('screen');
//         //     if (!granted) {
//         //         console.error('Screen recording permission denied');
//         //     }
//         // }
//     }
// };

