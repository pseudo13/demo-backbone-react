import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Router, history } from "backbone";
import { Dashboard } from "./dashboard/Dashboard";
import $ from "jquery";
import _ from 'underscore';
import defaultConfigs from "./assets/defaultConfigs.json"

const rootElement = document.getElementById("root");
const headerElement = rootElement.getElementsByTagName("header")[0];
const contentElement = rootElement.getElementsByClassName("content")[0];

const renderView = (View, container = contentElement) => {
    console.log("container", container)
    return ReactDOM.render(View, container);
}

const renderViewWithRoot = (View, container = contentElement) => {
    ReactDOM.render(<IndexPage />, headerElement);
    ReactDOM.render(View, container);
}

const NotFoundPage = () => {
    return <>
        <div>Diese Seite existiert nicht. Es fehlt noch der Inhalt.</div>
        <button onClick={() => history.navigate("", true)}>Zurueck auf Homepage</button>
    </>
}

const IndexPage = () => {

    const [links, setLinks] = useState([]);
    const [users, setUsers] = useState(["developer", "manager", "admin"])
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginUser, setLoginUser] = useState("developer");

    const [dashboard, setDashboard] = useState({});
    const [selectedLink, setSelectedLink] = useState("");

    useEffect(() => {
        const developer = ["dashboard"];
        const manager = ["dashboard", "team",];
        const admin = ["dashboard", "admin"];
        const allLinks = { developer, manager, admin };
        if (isLoggedIn && loginUser) {
            setLinks(allLinks[loginUser])
        }
    }, [isLoggedIn, loginUser])

    useEffect(() => {
        history.navigate("", true);
        ReactDOM.unmountComponentAtNode(contentElement);
        setSelectedLink(null);
    }, [isLoggedIn])

    useEffect(() => {
        const widgetConfigurationsStorageItem = localStorage.getItem("widetConfigurations");
        if (!widgetConfigurationsStorageItem) {
            localStorage.setItem("widgetConfigurations", JSON.stringify(defaultConfigs.widgetConfigurations))
        }
    }, [])

    return (<>
        <header>
            <div style={{ backgroundColor: "beige", padding: 5, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div>
                    <div style={{ fontSize: "large", fontWeight: "bold" }}>This is a demo app to learn Backbone.Js with React</div>
                    <div><i>Hint: Log in as admin to configurate dashboards</i></div>
                </div>
                <div>
                    {!isLoggedIn && <select onChange={e => setLoginUser(e.target.value)} value={loginUser}>
                        {
                            users.map(user => {
                                return <option key={user} value={user}>{user}</option>
                            })
                        }
                    </select>}
                    <button style={{ padding: 5, margin: 5 }} onClick={() => {
                        setIsLoggedIn(!isLoggedIn);
                        localStorage.setItem("role", loginUser)
                    }}>{isLoggedIn ? 'Logout' : 'Login'}</button>
                    {isLoggedIn && <span style={{ color: "green", fontWeight: "bold" }}>Logged in as {loginUser}</span>}
                </div>
            </div>


            {
                isLoggedIn && <div style={{ backgroundColor: "gray", padding: 5 }}>
                    <span>Navigation:</span>
                    <span>{links.map(link => {
                        return <button style={{
                            margin: 5, padding: 5, backgroundColor: link == selectedLink ? 'green' : "white", border: "none",
                            fontWeight: "bold", "textTransform": "uppercase", fontSize: "large"
                        }} onClick={() => {
                            setSelectedLink(link);
                            history.navigate(link, true)
                        }}>{link}</button>
                    })}
                    </span>
                </div>
            }
        </header>
    </>);
}



const DashboardView = () => {
    const role = localStorage.getItem("role");
    return <Dashboard role={role}></Dashboard>
}

const ProfilePage = props => (
    <div>
        <h1>Thanks for visiting the Profile Page</h1>
        <h2>The Profile ID is {props.profileId}</h2>
    </div>
);

const SearchPage = props => (
    <div>
        <h1>Searching for {props.searchTerm}...</h1>
    </div>
);

(function () {
    /**
        * Backbone.routeNotFound
        *
        * Simple plugin that listens for false returns on Backbone.history.loadURL and fires an event
        * to let the application know that no routes matched.
        *
        * @author STRML
        */
    var oldLoadUrl = Backbone.History.prototype.loadUrl;

    _.extend(Backbone.History.prototype, {

        /**
         * Override loadUrl & watch return value. Trigger event if no route was matched.
         * @return {Boolean} True if a route was matched
         */
        loadUrl: function () {
            var matched = oldLoadUrl.apply(this, arguments);
            if (!matched) {
                this.trigger('routeNotFound', arguments);
            }
            return matched;
        }
    });
}).call(this);

const AppRouter = Router.extend({
    initialize: function () {
        this.listenTo(history, 'routeNotFound', this.onRouteNotFound);
    },
    routes: {
        "": "init",
        "dashboard": "dashboard",
    },
    init: () => renderView(<IndexPage />, headerElement),
    dashboard: () => renderViewWithRoot(<DashboardView />),
    onRouteNotFound: () => {
        return renderViewWithRoot(<NotFoundPage />)
    }
});

new AppRouter();

history.start({ pushState: true, root: '/' });