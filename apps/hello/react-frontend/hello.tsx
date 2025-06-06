import React, { useState } from "react";
import { Card, Logo, Dropdown, DropdownItem, Search } from "./components";


const colorList: Array<DropdownItem> = [
    {value: "black", desc: "Black"},
    {value: "blue", desc: "Blue" },
    {value: "violet", desc: "Violet"},
    {value: "red", desc: "Red"},
    {value: "green", desc: "Green"},
    {value: "#A47864", desc: "Mocha Mousse"},
    {value: "#E3BD33", desc: "Misted Marigold"}
]

const componentList: Array<DropdownItem> = [
    {value: "search", desc: "Search Bar"},
    {value: "card", desc: "Message Card" },
    {value: "logo", desc: "React Logo" },
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

export default function Interface() {
    const [stamps, setStamps] = useState<StampState[]>([]);
    const [history, setHistory] = useState<StampState[][]>([[]]);
    const [componentName, setComponentName] = useState(componentList[0]['value']);
    const [inkColor, setInkColor] = useState(colorList[0]['value']);
    const [inkSaturation, setInkSaturation] = useState(100);

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
                setInkColor(colorList[0]['value']);
                setComponentName(componentList[0]['value']);
        }
    };

    function renderStamp(stampState: StampState) {
        if (stampState.componentName === "search") {
            return <Search color={stampState.color} saturation={stampState.saturation} />
        } else if (stampState.componentName === "card") {
            return <Card color={stampState.color} saturation={stampState.saturation} />
        } else if (stampState.componentName === "logo") {
            return <Logo color={stampState.color} saturation={stampState.saturation} />
        }
    };

    return (
        <div>
            <div id="topRow">
                <button onClick={handleClick}>
                    Add Stamp
                </button>
                <Dropdown options={colorList} label="Ink Color" selected={inkColor} onChange={handleColorChange} />
                <Dropdown options={componentList} label="Stamp Design" selected={componentName} onChange={handleComponentChange} />
                <Dropdown options={historyList(history)} label="History" selected="" onChange={handleHistoryChange} />
            </div>
            <ul id="stampList">
                { stamps.map((stampState: StampState, index) => 
                <li key={index}>
                    {renderStamp(stampState)}
                </li>
                )}
            </ul>
        </div>
    );
}
