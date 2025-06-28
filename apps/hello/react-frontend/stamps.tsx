import React, { useState, useEffect, useRef } from 'react';
import { Card, Logo, Dropdown, DropdownItem, Search, ColorPicker, ThemeToggle, Button, ProgressBar, PopupContent } from './components';

const displayNames: Record<string, string> = {
    '#4a4a4a': 'gray',
    '#3b82f6': 'blue',
    '#A47864': 'Mocha Mousse',
    '#E3BD33': 'gold',
    'search': 'Search Bar',
    'card': 'Message Card',
    'button': 'Button',
    'progress': 'Progress Bar',
    'logo': 'React Logo',
    'popup': 'Popup Window',
};

const colorList = [
    'red',
    '#E3BD33',
    'green',
    '#3b82f6',
    'violet',
    '#A47864',
    '#4a4a4a',
];

const componentList = [
    'card',
    'button',
    'progress',
    'logo',
    'popup',
    'search',
];

function displayName(value: string): string {
    return displayNames[value] || value;
}

const colorOptions: Array<DropdownItem> = colorList.map((v) => { 
    return {value: v, desc: displayName(v)}
});

const componentOptions: Array<DropdownItem> = componentList.map((v) => { 
    return {value: v, desc: displayName(v)}
});

interface StampState {
    componentName: string;
    color: string;
    saturation: number;
}

function historyList(history: Array<StampState[]>): Array<DropdownItem> {
    let opts: Array<DropdownItem> = [];
    for (const i in history) {
        let desc = 'Initial';
        let lastStamp = history[i].at(-1);
        if (lastStamp !== undefined) {
            desc = `Added ${displayName(lastStamp.color)} ${displayName(lastStamp.componentName)}`;
        }
        opts.push({ 'value': i, 'desc': desc });
    }
    return opts;
}

const stampOptions = [
    { id: 'search', label: 'Search', component: Search },
    { id: 'progress', label: 'Progress Bar', component: ProgressBar },
];

export default function Interface() {
    const [stamps, setStamps] = useState<StampState[]>([]);
    const stampsEndRef = useRef<HTMLDivElement>(null);
    const [history, setHistory] = useState<StampState[][]>([[]]);
    const [componentName, setComponentName] = useState(componentOptions[0]['value']);
    const [inkColor, setInkColor] = useState(colorList[0]);
    const [inkSaturation, setInkSaturation] = useState(100);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        // Check if user has a saved preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme as 'light' | 'dark';
        }
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const scrollToBottom = () => {
        stampsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [stamps]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            // Only update if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    function handleColorChange(colorValue: string) {
        setInkSaturation(100);
        setInkColor(colorValue);
    }

    function handleComponentChange(componentValue: string) {
        setInkSaturation(100);
        setComponentName(componentValue);
    }

    function handleClick() {
        const newStamps = [...stamps, { color: inkColor, saturation: inkSaturation, componentName: componentName }];
        setStamps(newStamps);
        setHistory([...history, [...newStamps]]);
        if (inkSaturation > 16) {
            setInkSaturation(inkSaturation - 14);
        }
    }

    function handleHistoryChange(value: string) {
        const index = Number(value);
        if (index > 0) {
            const stamps = history[index];
            const lastStamp = stamps.at(-1);
            setStamps(stamps);
            if (lastStamp !== undefined) {
                setInkSaturation(lastStamp.saturation);
                setInkColor(lastStamp.color);
                setComponentName(lastStamp.componentName);
            }
        } else { // reset to initial state
            setStamps([]);
            setInkSaturation(100);
            setInkColor(colorList[0]);
            setComponentName(componentOptions[0]['value']);
        }
    }

    function renderStamp(index: number, stampState: StampState) {
        const style = { '--inkColor': stampState.color, 'opacity': stampState.saturation / 100 };
        if (stampState.componentName === 'search') {
            return <Search style={style} />;
        } else if (stampState.componentName === 'card') {
            return <Card style={style} />;
        } else if (stampState.componentName === 'logo') {
            return <Logo style={style} />;
        } else if (stampState.componentName === 'button') {
            return <Button
                style={style}
                onClick={() => {
                    alert('I am a rogue AI');
                }}
            >Click Me</Button>;
        } else if (stampState.componentName === 'progress') {
            return <ProgressBar orientation='horizontal' style={style} />;
        } else if (stampState.componentName === 'popup') {
            return <PopupContent
                message='I am a rogue AI'
                style={style}
                onClose={() => {
                    const newStamps = stamps.filter((_, i) => i !== index);
                    setStamps(newStamps);
                }}
            />;
        }
    }

    const handleClearAll = () => {
        setStamps([]);
        setInkSaturation(100);
        setHistory([[]]);
    };

    const inkSaturationBarStyle = { '--inkColor': inkColor, 'opacity': 100 };

    return (
        <div>
            <div id='shroud'></div>
            <div className='hud right'>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
                <ProgressBar
                    style={inkSaturationBarStyle}
                    progress={inkSaturation}
                    orientation='vertical'
                    name="Ink Saturation"
                />
            </div>
            <div className='hud left'>
                <div className='button-group'>
                    <ColorPicker
                        colors={colorOptions}
                        selectedColor={inkColor}
                        onColorSelect={handleColorChange}
                    />
                </div>
                <div className='button-group'>
                    <Dropdown options={componentOptions} label='Stamp Design' selected={componentName} onChange={handleComponentChange} />
                    <Dropdown
                        options={historyList(history)}
                        label='History'
                        selected=''
                        onChange={handleHistoryChange}
                    />
                </div>
                <div className='button-group'>
                    <Button onClick={handleClick}>
                        Add Stamp
                    </Button>
                    <Button onClick={handleClearAll} variant='danger'>
                        Clear All
                    </Button>
                </div>
            </div>
            <ul id='stampList'>
                {stamps.map((stampState: StampState, index) =>
                    <li key={index} className='stamp-item'>
                        {renderStamp(index, stampState)}
                    </li>
                )}
                <div ref={stampsEndRef} />
            </ul>
        </div>
    );
}
