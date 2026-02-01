import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

const Dropdown = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
                {selectedOption?.label}
                <span className={`arrow ${isOpen ? 'up' : 'down'}`}>▼</span>
            </button>

            {isOpen && (
                <ul className="dropdown-menu">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={value === option.value ? 'active' : ''}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
