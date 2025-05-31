import React, { ChangeEvent, useState } from "react";

interface DropdownItem {
    value: string,
    desc: string,
}

interface DropdownProps {
    options: DropdownItem[],
    onChange: (arg1: string) => void
}

function Dropdown({options, onChange}: DropdownProps) {
    const [selected, setSelected] = useState("");

    const optionList = options.map((option, index) => (
        <option key={index} value={option.value}>{option.desc}</option>
    ));

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        setSelected(event.target.value);
        onChange(event.target.value);
    };

    return (
        <select value={selected} onChange={handleSelectChange}>
            <option value="">Select an option</option>
            { optionList }
        </select>
    );
}

function Logo() {
    return (
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/330px-React-icon.svg.png" alt="React"/>
    );
}

function Card() {
    return (
        <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
            <img className="size-12 shrink-0" src="/img/logo.svg" alt="ChitChat Logo" />
            <div>
                <div className="text-xl font-medium text-black dark:text-white">ChitChat</div>
                <p className="text-gray-500 dark:text-gray-400">You have a new message!</p>
            </div>
        </div>
    );
}

interface SearchProps {
    color: string;
    saturation: number;
}

function Search({color, saturation}: SearchProps) {
    return (
        <div className='max-w-md mx-auto'>
            <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
            <div className="grid place-items-center h-full w-12 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                type="text"
                id="search"
                placeholder={`Search something.. ${color}/${saturation}`} /> 
        </div>
    </div>
    );
}

export { Card, Dropdown, DropdownItem, Search }