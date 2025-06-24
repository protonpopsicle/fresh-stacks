import React, { ChangeEvent, useState } from 'react';

interface DropdownItem {
    value: string;
    desc: string;
}

interface DropdownProps {
    options: DropdownItem[];
    label: string;
    selected: string;
    onChange: (arg1: string) => void;
}

function Dropdown({ options, label, selected, onChange }: DropdownProps) {
    const optionList = options.map((option, index) => (
        <option key={index} value={option.value}>{option.desc}</option>
    ));

    function handleSelectChange(event: ChangeEvent<HTMLSelectElement>) {
        onChange(event.target.value);
    }

    return (
        <select value={selected} onChange={handleSelectChange}>
            <option disabled value=''>{label}</option>
            {optionList}
        </select>
    );
}

interface LogoProps {
    style?: React.CSSProperties;
}

function Logo({ style }: LogoProps) {
    return (
        <div className='logo-container' style={style}>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='-11.5 -10.23174 23 20.46348'
                width='80' height='80'>
                <title>React Logo</title>
                <circle cx='0' cy='0' r='2.05' fill='currentColor' />
                <g stroke='currentColor' strokeWidth='1' fill='none'>
                    <ellipse rx='11' ry='4.2' />
                    <ellipse rx='11' ry='4.2' transform='rotate(60)' />
                    <ellipse rx='11' ry='4.2' transform='rotate(120)' />
                </g>
            </svg>
        </div>
    );
}

interface CardProps {
    style?: React.CSSProperties;
    title?: string;
    message?: string;
}

function Card({ style, title = 'ChitChat', message = 'You have a new message!' }: CardProps) {
    return (
        <div className='card-container' style={style}>
            <div className='card-icon'>
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
                </svg>
            </div>
            <div className='card-content'>
                <div className='card-title'>{title}</div>
                <p className='card-message'>{message}</p>
            </div>
        </div>
    );
}

// Mock data for search results
const mockSearchResults = [
    { id: 1, title: 'Getting Started with React', category: 'Tutorial' },
    { id: 2, title: 'Advanced React Patterns', category: 'Article' },
    { id: 3, title: 'React Hooks Explained', category: 'Documentation' },
    { id: 4, title: 'React Performance Tips', category: 'Guide' },
    { id: 5, title: 'React vs Vue', category: 'Comparison' },
];

interface SearchProps {
    style?: React.CSSProperties;
}

function Search({ style }: SearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
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

    return (
        <div className='search-container' style={style} ref={searchContainerRef}>
            <div className='search-icon'>
                <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <circle cx='11' cy='10' r='7' />
                    <path d='m21 20-5-5' />
                </svg>
            </div>
            <div className='search-input-wrapper'>
                <input
                    type='text'
                    className='search-input'
                    placeholder='Search'
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
                    <div className='search-results'>
                        {filteredResults.length > 0 ? (
                            filteredResults.map((result, index) => (
                                <div
                                    key={result.id}
                                    className={`search-result-item ${index === focusedIndex ? 'focused' : ''}`}
                                    tabIndex={0}
                                >
                                    <div className='result-title'>{result.title}</div>
                                    <div className='result-category'>{result.category}</div>
                                </div>
                            ))
                        ) : (
                            <div className='search-result-item no-results'>
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
    colors: DropdownItem[];
    selectedColor: string;
    onColorSelect: (color: string) => void;
}

function ColorPicker({ colors, selectedColor, onColorSelect }: ColorPickerProps) {
    return (
        <div className='color-picker'>
            {colors.map((color, index) => (
                <button
                    key={index}
                    className={`color-circle ${selectedColor === color.value ? 'selected' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => onColorSelect(color.value)}
                    aria-label={`Select color ${color.value}`}
                    title={color.desc}
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
    const label = `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`;
    return (
        <button title={label} className='theme-toggle' onClick={onToggle} aria-label={label}>
            {theme === 'light' ? (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
                </svg>
            ) : (
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <circle cx='12' cy='12' r='4' />
                    <path d='M12 2v2' />
                    <path d='M12 20v2' />
                    <path d='m4.93 4.93 1.41 1.41' />
                    <path d='m17.66 17.66 1.41 1.41' />
                    <path d='M2 12h2' />
                    <path d='M20 12h2' />
                    <path d='m6.34 17.66-1.41 1.41' />
                    <path d='m19.07 4.93-1.41 1.41' />
                </svg>
            )}
        </button>
    );
}

interface ButtonProps {
    onClick?: () => void;
    children?: React.ReactNode;
    variant?: 'danger' | 'icon';
    className?: string;
    style?: React.CSSProperties;
}

function Button({ onClick, children, variant, className = '', style }: ButtonProps) {
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

interface PopupProps {
    message: string;
    onClose?: () => void;
    style?: React.CSSProperties;
}

function PopupContent({ message, onClose, style }: PopupProps) {
    return (
        <div className='popup-preview' style={style}>
            <div className='popup-preview-header'>
                <h3>Message</h3>
                <Button onClick={onClose} variant='icon' className='popup-close'>
                    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <line x1='18' y1='6' x2='6' y2='18'></line>
                        <line x1='6' y1='6' x2='18' y2='18'></line>
                    </svg>
                </Button>
            </div>
            <div className='popup-preview-message'>{message}</div>
        </div>
    );
}

function Popup({ message, onClose, style }: PopupProps) {
    return (
        <div className='popup-overlay' onClick={onClose}>
            <div className='popup-content' style={style} onClick={e => e.stopPropagation()}>
                <PopupContent message={message} onClose={onClose} style={style} />
            </div>
        </div>
    );
}

interface ProgressBarProps {
    progress?: number;
    orientation?: 'vertical' | 'horizontal';
    style?: React.CSSProperties;
    name?: string;
}

function ProgressBar({ style, progress = 50, orientation = 'horizontal', name='' }: ProgressBarProps) {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    let title = progress + '%';

    if (name !== '') {
        title = name + ' - ' + title;
    }

    return (
        <div title={title} className={`progress-bar ${orientation}`} style={style}>
            <div
                className='progress-fill'
                style={{
                    [orientation === 'vertical' ? 'height' : 'width']: `${clampedProgress}%`,
                }}
            ></div>
        </div>
    );
}

export { Card, Dropdown, DropdownItem, Search, Logo, ColorPicker, ThemeToggle, Button, ProgressBar, Popup, PopupContent };