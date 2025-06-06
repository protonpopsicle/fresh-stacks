import React, { ChangeEvent, useState } from "react";

interface DropdownItem {
    value: string,
    desc: string,
}

interface DropdownProps {
    options: DropdownItem[],
    label: string,
    selected: string,
    onChange: (arg1: string) => void
}

function Dropdown({options, label, selected, onChange}: DropdownProps) {
    const optionList = options.map((option, index) => (
        <option key={index} value={option.value}>{option.desc}</option>
    ));

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        onChange(event.target.value);
    };

    return (
        <select value={selected} onChange={handleSelectChange}>
            <option disabled value="">{label}</option>
            { optionList }
        </select>
    );
}

interface LogoProps {
    color: string;
    saturation: number;
}

function Logo({color, saturation}: LogoProps) {
    const style = {"--inkColor": color, "opacity": saturation / 100 } as React.CSSProperties;
    return (
        <div className="stamp logo-container" style={style}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348"
            width="80" height="80">
                <title>React Logo</title>
                <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
                <g stroke="currentColor" stroke-width="1" fill="none">
                    <ellipse rx="11" ry="4.2"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                </g>
            </svg>
        </div>
    );
}

interface StampProps {
    color: string;
    saturation: number;
}

function Card({color, saturation}: StampProps) {
    const style = {"--inkColor": color, "opacity": saturation / 100 } as React.CSSProperties;
    return (
        <div className="stamp card-container" style={style}>
            <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            </div>
            <div className="card-content">
                <div className="card-title">ChitChat</div>
                <p className="card-message">You have a new message!</p>
            </div>
        </div>
    );
}

function Search({color, saturation}: StampProps) {
    const style = {"--inkColor": color, "opacity": saturation / 100 } as React.CSSProperties;
    return (
        <div className="stamp search-container" style={style}>
            <div className="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="10" r="7"/>
                    <path d="m21 20-5-5"/>
                </svg>
            </div>
            <input
                type="text"
                className="search-input"
                placeholder="Search"
            />
        </div>
    );
}

export { Card, Dropdown, DropdownItem, Search, Logo }