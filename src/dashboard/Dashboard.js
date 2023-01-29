import React, { useState, useCallback, useEffect } from 'react';
import GridLayout from 'react-grid-layout';

import { DashboardWidget } from './DashboardWidget';
import { WidgetSelector } from '../widget/WidgetSelector';
import "../styles.css"

import { availableWidgets } from "../widget/WidgetSelector"

const defaultWidgets = [
    {
        id: 'IncrementWidget',
        layout: { i: 'IncrementWidget', x: 0, y: 0, w: 3, h: 1, isDraggable: false },
    },
    {
        id: 'DecrementWidget',
        layout: { i: 'DecrementWidget', x: 0, y: 1, w: 2, h: 1, isDraggable: false },
    }
];

export const Dashboard = ({ role }) => {
    const [widgets, setWidgets] = useState([]);

    const [editAllowed, setEditAllowed] = useState(role == 'admin');

    const onLayoutChange = useCallback(
        (_, oldItem, newItem) => {

            if (newItem && oldItem) {
                const newWidgetArr = [...widgets];
                newWidgetArr.forEach((x) => {
                    if (x.id === newItem.i) {
                        x.layout.width = newItem.w;
                        x.layout.height = newItem.h;
                        x.layout.x = newItem.x;
                        x.layout.y = newItem.y;
                    }
                });
                setWidgets(newWidgetArr);
            }


        },
        [widgets]
    );

    const onDrop = useCallback(
        (_, item, e) => {
            const raw = e.dataTransfer?.getData('droppableWidget');
            if (!raw) {
                return;
            }

            const droppableWidget = JSON.parse(raw);
            const newWidgetArr = [...widgets];
            droppableWidget.layout.x = item.x ?? 0;
            droppableWidget.layout.y = item.y ?? 0;
            droppableWidget.layout.isDraggable = true;
            newWidgetArr.push(droppableWidget);

            setWidgets(newWidgetArr);
        },
        [widgets],
    );

    useEffect(() => {
        // Load widgets base on role

    }, []);

    useEffect(() => {
        // Add any logic here to presist widgets and their layout to any presistent storage, like localStorage or any API
    }, [widgets]);

    useEffect(() => {
        if (!role || role == 'admin') return;
        try {
            const rightsStorageItem = localStorage.getItem("widgetConfigurations");
            const configs = JSON.parse(rightsStorageItem);
            setWidgets(configs[role]);
        } catch (e) {
            setWidgets([]);
        }
    }, [role])

    const userDashboard = (<>
        {widgets.length == 0 && <h1>No widgets selected. Please select one by dragging over!</h1>}
        <GridLayout width={1600} className='layout' autoSize layout={widgets.map(w => w.layout)}>
            {widgets.map(x => (
                <DashboardWidget key={x.id} className="widget" widget={x} data-grid={x.layout} />
            ))}</GridLayout>
    </>);

    const roles = ["developer", "manager", "admin"];
    const [selectedConfigRole, setSelectedConfigRole] = useState(null);

    /**
     * Simulate loading widget configuration from backend
     * @param {*} role 
     */
    const loadWidget = role => {
        setSelectedConfigRole(role);
        let configs = {};
        try {
            configs = JSON.parse(localStorage.getItem("widgetConfigurations"));
            setWidgets(configs[role] ?? []);
        } catch (e) {

        }
    }

    /**
     * Simulate saving widget configuration in data storage
     * @param {*} role 
     */
    const saveWidget = role => {
        let configs = {};
        try {
            configs = JSON.parse(localStorage.getItem("widgetConfigurations")) ?? {};
        } catch (e) {
        }
        configs[role] = widgets;
        localStorage.setItem("widgetConfigurations", JSON.stringify(configs));
    }

    const removeWidget = (widget) => {
        const filterWidgets = widgets.filter(w => w.id != widget.id);
        setWidgets(filterWidgets);
    }

    return (
        <>
            {editAllowed ?
                <>
                    <div style={{ backgroundColor: "beige", padding: 5 }}>
                        <span>Select layout for:</span> {roles.map(configRole => <span style={{ backgroundColor: selectedConfigRole == configRole ? 'green' : 'gray', margin: "5px", padding: "5px" }} onClick={() => loadWidget(configRole)}> {configRole}</span>)}
                        <button onClick={() => saveWidget(selectedConfigRole)}>Save widget layout</button>
                    </div>
                    {
                        selectedConfigRole !== null ? <>
                            <WidgetSelector />
                            {widgets.length == 0 && <h1>No widgets selected. Please select one by dragging over!</h1>}
                            <GridLayout
                                style={{ minHeight: "1000px" }}
                                className='layout'
                                autoSize
                                preventCollision
                                useCSSTransforms
                                isDroppable
                                compactType={"vertical"}
                                width={1600}
                                onDrop={onDrop}
                                onDragStop={onLayoutChange}
                                onResizeStop={onLayoutChange}
                                onLayoutChange={onLayoutChange}
                                layout={widgets.map(w => w.layout)}
                            >
                                {widgets.map(x => {
                                    x.removeWidget = () => removeWidget(x);
                                    return <DashboardWidget key={x.id} className="widget" widget={x} data-grid={x.layout} editable={editAllowed} />
                                })}
                            </GridLayout></> : "Please select a role from above fir"}</>
                : userDashboard
            }

        </>
    );
};