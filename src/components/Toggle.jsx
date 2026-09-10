import { useState } from 'react'
import './Toggle.css'

function Toggle() {
    const [showGDP, setShowGDP] = useState(true)

    return (
        <div className="toggle">
            <h3 className="toggle-title">Indicator</h3>

            <div className="toggle-buttons">
                <button
                    className={`toggle-button ${showGDP ? 'active' : ''}`}
                    onClick={() => setShowGDP(true)}
                >
                    GDP
                </button>

                <button
                    className={`toggle-button ${!showGDP ? 'active' : ''}`}
                    onClick={() => setShowGDP(false)}
                >
                    Population
                </button>
            </div>

            {showGDP ? (
                <div className="toggle-value">
                    $8.58 T
                </div>
            ) : (
                <div className="toggle-value">
                    226.4 M
                </div>
            )}
        </div>
    )
}

export default Toggle