import React, { useState, useEffect } from 'react';
import CardList from '../components/CardList';
import SearchBox from '../components/SearchBox';
import Scroll from '../components/Scroll';
import ErrorBoundry from '../components/ErrorBoundry';
import './App.css';
import { fetchToken, onMessageListener } from './firebase';
import { Button, Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    // constructor() {
    //     super()
    //     this.state = {
    //         robots: [],
    //         searchfield: ''
    //     }
    // }
    const [robots, setRobots] = useState([]) //use state returns a piece of state and function that changes that state. (pass initial value of state variable, in this case empty array.)
    const [searchfield, setSearchfield] = useState('')
    const [count, setCount] = useState(0)
    // componentDidMount() {
    //     fetch('https://jsonplaceholder.typicode.com/users')
    //         .then(response => response.json())
    //         .then(users => this.setState({ robots: users }))

    // }
    const [show, setShow] = useState(false);
    const [notification, setNotification] = useState({ title: '', body: '',action:'' });
    const [isTokenFound, setTokenFound] = useState(false);
    fetchToken(setTokenFound);

    onMessageListener().then(payload => {
        console.log("message payload: " + JSON.stringify(payload));
        setNotification({ title: payload.notification.title, body: payload.notification.body, action: payload.fcmOptions.link })
        setShow(true);
        
    }).catch(err => console.log('failed: ', err));

    const onShowNotificationClicked = () => {
        setNotification({ title: "Notification", body: "This is a test notification" })
        setShow(true);
    }

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(users => { setRobots(users) })

    }, []) //add optional list to tell when to stop useEffect.  An Empty list will only tell useEffect to run once.

    const onSearchChange = (event) => {
        setSearchfield(event.target.value)
    }

    // const { robots, searchfield } = this.state;
    const filteredRobots = robots.filter(robot => {
        return robot.name.toLowerCase().includes(searchfield.toLowerCase())
    })
    if (!robots.length) {
        return (
            <div className='tc'>
                <h1 className='f1'>Loading</h1>
            </div>
        )
    } else {
        return (
            <div>
                <a href={notification.action}>
                    <Toast  onClose={() => setShow(false)} show={show} delay={5000} autohide animation style={{
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
                    <Button onClick={() => onShowNotificationClicked()}>Show Toast</Button>
                    {isTokenFound && <h1> Notification permission enabled 👍🏻 </h1>}
                    {!isTokenFound && <h1> Need notification permission ❗️ </h1>}
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

export default App