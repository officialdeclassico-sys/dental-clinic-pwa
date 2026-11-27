import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {initNeumorphicPress} from './utils/neumorphicPress';
import {initGlobalHaptics} from './utils/haptics';

initNeumorphicPress();
initGlobalHaptics();

createRoot(document.getElementById('root')!).render(<App />);
