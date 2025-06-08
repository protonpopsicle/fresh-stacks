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

// Mock data for search results
const mockSearchResults = [
    { id: 1, title: "Getting Started with React", category: "Tutorial" },
    { id: 2, title: "Advanced React Patterns", category: "Article" },
    { id: 3, title: "React Hooks Explained", category: "Documentation" },
    { id: 4, title: "React Performance Tips", category: "Guide" },
    { id: 5, title: "React vs Vue", category: "Comparison" }
];

function Search({color, saturation}: StampProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const searchContainerRef = React.useRef<HTMLDivElement>(null);
    
    const filteredResults = mockSearchResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowResults(false);
                setIsActive(false);
                setFocusedIndex(-1);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showResults || !searchQuery) return;

        if (e.key === 'Tab') {
            e.preventDefault();
            const nextIndex = (focusedIndex + 1) % filteredResults.length;
            setFocusedIndex(nextIndex);
        }
    };

    const style = {"--inkColor": color, "opacity": saturation / 100 } as React.CSSProperties;
    
    return (
        <div className="stamp search-container" style={style} ref={searchContainerRef}>
            <div className="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="10" r="7"/>
                    <path d="m21 20-5-5"/>
                </svg>
            </div>
            <div className="search-input-wrapper">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowResults(true);
                        setIsActive(true);
                        setFocusedIndex(-1);
                    }}
                    onFocus={() => setIsActive(true)}
                    onKeyDown={handleKeyDown}
                />
                {showResults && searchQuery && isActive && (
                    <div className="search-results">
                        {filteredResults.length > 0 ? (
                            filteredResults.map((result, index) => (
                                <div 
                                    key={result.id} 
                                    className={`search-result-item ${index === focusedIndex ? 'focused' : ''}`}
                                    tabIndex={0}
                                >
                                    <div className="result-title">{result.title}</div>
                                    <div className="result-category">{result.category}</div>
                                </div>
                            ))
                        ) : (
                            <div className="search-result-item no-results">
                                No results found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

interface ColorPickerProps {
    colors: string[];
    selectedColor: string;
    onColorSelect: (color: string) => void;
}

function ColorPicker({colors, selectedColor, onColorSelect}: ColorPickerProps) {
    return (
        <div className="color-picker">
            {colors.map((color, index) => (
                <button
                    key={index}
                    className={`color-circle ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => onColorSelect(color)}
                    aria-label={`Select color ${color}`}
                />
            ))}
        </div>
    );
}

interface ThemeToggleProps {
    theme: 'light' | 'dark';
    onToggle: () => void;
}

function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
    return (
        <button className="theme-toggle" onClick={onToggle} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2"/>
                    <path d="M12 20v2"/>
                    <path d="m4.93 4.93 1.41 1.41"/>
                    <path d="m17.66 17.66 1.41 1.41"/>
                    <path d="M2 12h2"/>
                    <path d="M20 12h2"/>
                    <path d="m6.34 17.66-1.41 1.41"/>
                    <path d="m19.07 4.93-1.41 1.41"/>
                </svg>
            )}
        </button>
    );
}

interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'danger' | 'icon';
    className?: string;
    color?: string;
    saturation?: number;
}

function Button({ onClick, children, variant = 'primary', className = '', color, saturation }: ButtonProps) {
    const style = color ? { 
        "--inkColor": color, 
        "opacity": saturation ? saturation / 100 : 1,
        "color": color,
        "borderColor": color
    } as React.CSSProperties : undefined;
    
    return (
        <button 
            onClick={onClick} 
            className={`button ${variant} ${className}`}
            style={style}
        >
            {children}
        </button>
    );
}

function StampableButton({ color, saturation }: StampProps) {
    return (
        <Button color={color} saturation={saturation} className="stamp">
            Click Me
        </Button>
    );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
    return (
        <Button onClick={onClick} variant="icon" className="delete-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </Button>
    );
}

function ProgressBar({ color, saturation, progress = 50, orientation = 'horizontal' }: StampProps & { progress?: number, orientation?: 'vertical' | 'horizontal' }) {
    const style = { 
        "--inkColor": color, 
        "opacity": saturation / 100 
    } as React.CSSProperties;
    
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    
    return (
        <div className={`stamp progress-container ${orientation}`} style={style}>
            <div className="progress-bar">
                <div 
                    className="progress-fill" 
                    style={{ 
                        [orientation === 'vertical' ? 'height' : 'width']: `${clampedProgress}%` 
                    }}
                ></div>
            </div>
        </div>
    );
}

export { Card, Dropdown, DropdownItem, Search, Logo, ColorPicker, ThemeToggle, Button, DeleteButton, StampableButton, ProgressBar }