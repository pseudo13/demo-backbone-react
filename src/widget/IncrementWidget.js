import React, { useState, useCallback } from 'react';

const IncrementWidget = () => {
    const [count, setCount] = useState(100);

    const increment = useCallback(() => {
        setCount(count + 1);
    }, [count]);

    return (
        <div style={{ border: '1px solid red' }}>
            <div>Current Value = {count}</div>
            <button onClick={increment}>Increment</button>
        </div>
    );
};

export default IncrementWidget;