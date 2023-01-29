import React from 'react';

export const availableWidgets = [
    {
        previewImg: 'https://loremflickr.com/100/100/countup',
        previewName: 'Increment Widget',
        id: 'IncrementWidget',
        layout: { i: 'IncrementWidget', w: 3, h: 1 },
        isBackboneView: false,
    },
    {
        previewImg: 'https://loremflickr.com/100/100/timer',
        previewName: 'Decrement Widget',
        id: 'DecrementWidget',
        layout: { i: 'DecrementWidget', w: 3, h: 2 },
        isBackboneView: false,
    },
    {
        previewImg: 'https://loremflickr.com/100/100/dog',
        previewName: 'Dog Image',
        id: 'DogWidget',
        name: 'dog',
        layout: { i: 'DogWidget', w: 4, h: 2 },
        isBackboneView: true,
    },
    {
        previewImg: 'https://loremflickr.com/100/100/wisdom',
        previewName: 'Got bored?',
        id: 'BoredomWidget',
        name: 'boredom',
        isBackboneView: true,
        layout: { i: 'BoredomWidget', w: 3, h: 2 },
    },
    {
        previewImg: 'https://loremflickr.com/100/100/bitcoin',
        previewName: 'Bitcoin $$$',
        id: 'BitcoinChartWidget',
        name: 'bitcoin',
        isBackboneView: false,
        layout: { i: 'BitcoinChartWidget', w: 8, h: 3 },
    },
    {
        previewImg: 'https://loremflickr.com/100/100/joke',
        previewName: 'Jokes',
        id: 'JokesWidget',
        name: 'jokes',
        isBackboneView: true,
        layout: { i: 'JokesWidget', w: 3, h: 2 },
    },
];

export const WidgetSelector = () => {
    return (
        <div style={{ textAlign: "center", borderBottom: '1px solid', display: "flex", flexDirection: "column", justifyContent: "center", padding: 5, backgroundColor: "gray" }} className="selector">
            <h3>Drag and drop a widget from following list:</h3>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                {availableWidgets.map(widget => (
                    <div
                        key={widget.id + Math.random()}
                        unselectable="on"
                        onDragStart={e => {
                            e.dataTransfer.setData('text/plain', '');
                            const newWidget = { ...widget, id: widget.id + "_" + Math.random() };
                            e.dataTransfer.setData('droppableWidget', JSON.stringify(newWidget));
                            return true;
                        }}
                    >
                        <img src={widget.previewImg} />
                        <div>{widget.previewName}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};