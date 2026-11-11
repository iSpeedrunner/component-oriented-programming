import { useState } from 'react'
import './Toggle.css'

function Toggle({
    title = 'Indicator',
    firstLabel = 'First',
    secondLabel = 'Second',
    firstValue = 'First value',
    secondValue = 'Second value',
    initialMode = 'first',
}) {
    const [activeMode, setActiveMode] = useState(initialMode)
    const isFirstModeActive = activeMode === 'first'

    return (
        <div className="toggle">
            <h3 className="toggle-title">{title}</h3>

            <div className="toggle-buttons">
                <button
                    className={`toggle-button ${isFirstModeActive ? 'active' : ''}`}
                    onClick={() => setActiveMode('first')}
                >
                    {firstLabel}
                </button>

                <button
                    className={`toggle-button ${!isFirstModeActive ? 'active' : ''}`}
                    onClick={() => setActiveMode('second')}
                >
                    {secondLabel}
                </button>
            </div>

            {isFirstModeActive ? (
                <div className="toggle-value">
                    {firstValue}
                </div>
            ) : (
                <div className="toggle-value">
                    {secondValue}
                </div>
            )}
        </div>
    )
}

export default Toggle
