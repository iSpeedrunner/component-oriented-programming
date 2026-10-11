import { useState } from 'react'
import './Counter.css'

function Counter({
    title = 'Number of items',
    initialValue = 0,
    min = 0,
    max = 10,
    step = 1,
    itemLabel = 'items',
}) {
    const [count, setCount] = useState(initialValue);

    const increment = () => {
        setCount(currentCount => Math.min(currentCount + step, max));
    }

    const decrement = () => {
        setCount(currentCount => Math.max(currentCount - step, min));
    }

    const reset = () => {
        setCount(initialValue);
    }

    return (
        <div className="counter">
            <h3 className="counter-title">
                {title}
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
                Showing top {count} {itemLabel}
            </div>
        </div>
    );
}

export default Counter;
