import React, { useState } from "react";
import { Card, Dropdown, DropdownItem, Search } from "./components";


const colorList: Array<DropdownItem> = [
    {value: "bg-sky-500", desc: "Blue"},
    {value: "bg-red-500", desc: "Red" },
    {value: "bg-green-500", desc: "Green"},
    {value: "bg-yellow-500", desc: "Yellow"},
    {value: "bg-purple-500", desc: "purple"}
]

const stampList = [
    {
        name: "Search",
        component: Search
    },
    {
        name: "Card",
        component: Card
    }
]

interface InkState {
    color: string,
    saturation: number,
}

export default function Interface() {
    const [stamps, setStamps] = useState<InkState[]>([]);
    const [inkColor, setInkColor] = useState("");
    const [inkSaturation, setInkSaturation] = useState(100);

    function handleColorChange(colorValue: string) {
        setInkSaturation(100);
        setInkColor(colorValue);
    };

    function handleClick() {
        setStamps([...stamps, {color: inkColor, saturation: inkSaturation}]);
        if (inkSaturation > 10) {
            setInkSaturation(inkSaturation - 10);
        }
    };

    return (
        <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>
                Add Stamps
            </button>
            <h2>
                <i>Wazzup</i>
                {/* <Search color={colorList[color]} saturation={saturation} /> */}
                {/* {stamp.component({colorList[color], saturation}) */}
                <Dropdown options={colorList} onChange={handleColorChange}  />
            </h2>
            <ul>
                { stamps.map((inkState: InkState, index) => <li className={inkState.color} style={{opacity: inkState.saturation + '%'}} key={index}>Color: {inkState.color}</li>) }
            </ul>
        </div>
    );
}
