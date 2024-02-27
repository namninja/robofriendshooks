import React, { useState, useEffect, useMemo } from 'react';
import CardList from '../components/CardList';
import SearchBox from '../components/SearchBox';
import Scroll from '../components/Scroll';
import ErrorBoundry from '../components/ErrorBoundry';
import './App.css';
import { fetchToken, onMessageListener } from './firebase';
import { Button, Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [robots, setRobots] = useState([]);
    const [searchfield, setSearchfield] = useState('');
    const [count, setCount] = useState(0);
    const [show, setShow] = useState(false);
    const [notification, setNotification] = useState({ title: '', body: '', action: '' });
    const [isTokenFound, setTokenFound] = useState(false);

    // Fetch token and set token found state
    useEffect(() => {
        fetchToken(setTokenFound);
    }, []);

    // Listen for messages from firebase-messaging-sw.js and show notifications
    useEffect(() => {
        onMessageListener().then(payload => {
            console.log("message payload: " + JSON.stringify(payload));
            setNotification({ title: payload.data.title, body: payload.data.body, action: payload.data.click_action });
            setShow(true);
        }).catch(err => console.log('failed: ', err));
    }, []);

    // Fetch robots data from API
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(users => { setRobots(users) });

        // Listen for postMessage from firebase-messaging-sw.js and redirect webpage to URL in postMessage
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (!event.data.action) {
                return;
            }
            switch (event.data.action) {
                case 'redirect-from-notificationclick':
                    window.location.href = event.data.url;
                    break;
                // no default
            }
        });
    }, []);

    // Memoize filteredRobots to prevent unnecessary re-computation
    const filteredRobots = useMemo(() => {
        return robots.filter(robot => {
            return robot.name.toLowerCase().includes(searchfield.toLowerCase());
        });
    }, [robots, searchfield]);

    // Handle search field change
    const onSearchChange = (event) => {
        setSearchfield(event.target.value);
    };

    // Render loading if robots are still being fetched
    if (!robots.length) {
        return (
            <div className='tc'>
                <h1 className='f1'>Loading</h1>
            </div>
        );
    } else {
        // Render the main content when robots data is available
        return (
            <div>
                <a href={notification.action}>
                    <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide animation style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        minWidth: 200
                    }}>
                        <Toast.Header>
                            <img
                                src="https://avatars.githubusercontent.com/u/5148773?s=50&v=4"
                                className="rounded mr-2"
                                alt=""
                            />
                            <strong className="mr-auto">{notification.title}</strong>
                            <small>just now</small>
                        </Toast.Header>
                        <Toast.Body>{notification.body}</Toast.Body>
                    </Toast>
                </a>
                <div className='tc'>
                    <Button onClick={() => setNotification({ title: "Notification", body: "This is a test notification" })}>Show Toast</Button>
                    {isTokenFound && <h1> Notification permission enabled</h1>}
                    {!isTokenFound && <h1> Need notification permission</h1>}
                    <h1 className='f1'>RobotFriends</h1>
                    <button onClick={() => setCount(count + 1)}>Click Me!</button>
                    <h3 className='f1'>{count}</h3>
                    <button onClick={() => setCount(0)}>Reset</button>
                    <SearchBox searchChange={onSearchChange} />
                    <Scroll>
                        <ErrorBoundry>
                            <CardList robots={filteredRobots} />
                        </ErrorBoundry>
                    </Scroll>
                </div>
            </div>
        );
    }
}

export default App;
