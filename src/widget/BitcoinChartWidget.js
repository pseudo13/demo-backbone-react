import { CanvasJSChart } from 'canvasjs-react-charts'
import React, { useEffect, useRef, useState } from 'react';

const BitcoinChartWidget = () => {
    const [values, setValues] = useState([]);
    const countRef = useRef(0);
    var yVal = 15;
    var updateInterval = 5000;
    const url = "https://api.coindesk.com/v1/bpi/currentprice.json";
    const chart = useRef();

    const options = {
        title: {
            text: "Bitcoin Chart"
        },
        data: [{
            type: "line",
            dataPoints: values
        }],
        axisY: {
            minimum: 20000,
            maximum: 25000
        },
    }

    useEffect(() => {
        const fetchValue = async () => {
            const value = await (await fetch(url)).json();
            const numberValue = Number(value?.bpi.EUR.rate.replace(",", ""));
            console.log(numberValue)
            chart.current.options.axisY = {
                minimum: Math.floor(numberValue - 100),
                maximum: Math.floor(numberValue + 100)
            }
            countRef.current++;
            setValues((prev) => {
                const newValues = [...prev];
                newValues.push({ x: countRef.current, y: numberValue });
                if (newValues.length > 20) {
                    newValues.shift();
                }
                return newValues;
            })
        }

        fetchValue();
        const intervalId = setInterval(() => {
            fetchValue();
        }, updateInterval);

        return () => {
            clearInterval(intervalId);
        }
    }, [])

    const updateChart = () => {
        yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
        chart.render();
    }

    return (
        <div>
            <CanvasJSChart options={options}
                ref={chart}
            />
        </div >
    );

}

export default BitcoinChartWidget;