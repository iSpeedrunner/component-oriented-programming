import { useState } from 'react'
import './Counter.css'

function Counter () {
    const [count, setCount] = useState(3);

    const increment = () => {
        if(count < 10) {
            setCount(count + 1);    
        }
    }

    const decrement = () => {
        if(count > 1) {
            setCount(count - 1);
        }
    }

    const reset = () => {
        setCount(3);
    }

    return (
        <div className="counter">
            <h3 className="counter-title">
                Number of countries
            </h3>

            <div className="counter-controls">
                <button className="counter-button"
                onClick={decrement}>
                -
                </button>

                <span className="counter-value">
                {count}
                </span>

                <button className="counter-button"
                onClick={increment}>
                +
                </button>
            </div>

            <button className="reset-button"
            onClick={reset}>
                Reset
            </button>

            <div className="counter-description">
                Showing top {count} countries
            </div>
        </div>
    );
}

export default Counter;