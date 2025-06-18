import React, { useState, useEffect } from "react";
import { Card, Logo, Dropdown, DropdownItem, Search, ColorPicker, ThemeToggle, Button, ProgressBar, Popup } from "./components";

const colorList = [
    "#4a4a4a",
    "#3b82f6",
    "violet",
    "red",
    "green",
    "#A47864",
    "#E3BD33"
];

const componentList: Array<DropdownItem> = [
    {value: "search", desc: "Search Bar"},
    {value: "card", desc: "Message Card"},
    {value: "button", desc: "Button"},
    {value: "progress", desc: "Progress Bar"},
    {value: "logo", desc: "React Logo"},
    {value: "popup", desc: "Popup Window"},
]

interface StampState {
    componentName: string,
    color: string,
    saturation: number
}

function historyList(history: Array<StampState[]>): Array<DropdownItem> {
    let opts: Array<DropdownItem> = [];
    for (const i in history) {
        let lastStamp = history[i].at(-1);
        opts.push({"value": i, "desc": `${i}: ${lastStamp?.color || ''} ${lastStamp?.componentName || ''}`});
    }
    return opts;
}

const stampOptions = [
    { id: 'search', label: 'Search', component: Search },
    { id: 'progress', label: 'Progress Bar', component: ProgressBar }
];

export default function Interface() {
    const [stamps, setStamps] = useState<StampState[]>([]);
    const [history, setHistory] = useState<StampState[][]>([[]]);
    const [componentName, setComponentName] = useState(componentList[0]['value']);
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
    };

    function handleComponentChange(componentValue: string) {
        setInkSaturation(100);
        setComponentName(componentValue);
    };

    function handleClick() {
        const newStamps = [...stamps, {color: inkColor, saturation: inkSaturation, componentName: componentName}];
        setStamps(newStamps);
        setHistory([...history, [...newStamps]]);
        if (inkSaturation > 16) {
            setInkSaturation(inkSaturation - 14);
        }
    };

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
                setComponentName(componentList[0]['value']);
        }
    };

    function renderStamp(index: number, stampState: StampState) {
        const style = {"--inkColor": stampState.color, "opacity": stampState.saturation / 100 };
        if (stampState.componentName === "search") {
            return <Search style={style} />
        } else if (stampState.componentName === "card") {
            return <Card style={style} />
        } else if (stampState.componentName === "logo") {
            return <Logo style={style} />
        } else if (stampState.componentName === "button") {
            return <Button style={style}>Click Me</Button>
        } else if (stampState.componentName === "progress") {
            return <ProgressBar style={style} />
        } else if (stampState.componentName === "popup") {
            return <Popup 
                message="I am a rogue AI"
                style={style}
                onClose={() => {
                    const newStamps = stamps.filter((_, i) => i !== index);
                    setStamps(newStamps);
                }}
            />
        }
    };

    const handleClearAll = () => {
        setStamps([]);
        setInkSaturation(100);
        setHistory([]);
    };

    const inkSaturationBarStyle = {"--inkColor": inkColor, "opacity": 100 };

    return (
        <div>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <div id="topRow">
                <div className="button-group">
                    <Button onClick={handleClick}>
                        Add Stamp
                    </Button>
                    <Button onClick={handleClearAll} variant="danger">
                        Clear All
                    </Button>
                </div>
                <ColorPicker 
                    colors={colorList}
                    selectedColor={inkColor}
                    onColorSelect={handleColorChange}
                />
                <Dropdown options={componentList} label="Stamp Design" selected={componentName} onChange={handleComponentChange} />
                <Dropdown
                    options={historyList(history)}
                    label="History"
                    selected=""
                    onChange={handleHistoryChange}
                />
                <div className="saturation-display">
                    <ProgressBar 
                        style={inkSaturationBarStyle} 
                        progress={inkSaturation}
                        orientation="vertical"
                    />
                    <span className="saturation-label">Ink Saturation</span>
                </div>
            </div>
            <ul id="stampList">
                { stamps.map((stampState: StampState, index) => 
                <li key={index} className="stamp-item">
                    {renderStamp(index, stampState)}
                </li>
                )}
            </ul>
        </div>
    );
}
