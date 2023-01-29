import React, { forwardRef, Suspense, useEffect, useState } from 'react';
import loadable from '@loadable/component';
import $ from "jquery";


const loadWidget = widget => {
  return React.lazy(() => import(`../widget/${widget.id}`));
};

export const DashboardWidget = forwardRef((props, ref) => {
  const { widget, editable } = props;
  const { isBackboneView, removeWidget } = widget;
  const [WidgetComponent, setWidgetComponent] = useState(null)  //loadComponent(widget));
  const [BackboneComponent, setBackboneComponent] = useState(null);

  const [uniqueId, setUniqueId] = useState("Backbone_" + Math.random().toString().replace(".", ""));
  useEffect(() => {
    const generateBackboneComponent = async (widgetName) => {
      const { createComponent } = await import(`../widget/${widgetName}`);
      setTimeout(async () => {
        if (!createComponent) return;
        const domElement = $("#" + uniqueId)
        const createResponse = await createComponent(
          domElement
        );
        createResponse.newView?.render();
        clearIntervalId = createResponse.intervalId;
      }, 500);

    }
    let clearIntervalId = null;
    const widgetName = widget.id.split("_")[0];
    if (isBackboneView) {
      generateBackboneComponent(widgetName);
    } else {
      setWidgetComponent(loadable(() => import(`../widget/${widgetName}`), { ssr: false }))
    }
    return () => {
      if (clearIntervalId) {
        clearInterval(clearIntervalId);
      }

    }
  }, [isBackboneView])

  const removeAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeWidget();

  }

  return (
    <div ref={ref} {...props}>
      <Suspense fallback={<>Loading</>}>
        {editable && <button onClick={removeAction}>Remove</button>}
        {WidgetComponent && <WidgetComponent id={uniqueId} />}
        {!WidgetComponent && <div id={uniqueId}></div>}
        {props.children}
        <div style={{ color: "white", backgroundColor: "green" }}>{isBackboneView ? 'Backbone component' : 'React component'}</div>
      </Suspense>
    </div>
  );
});