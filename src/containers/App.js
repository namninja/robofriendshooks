import React, { useState, useEffect } from 'react';
import CardList from '../components/CardList';
import SearchBox from '../components/SearchBox';
import Scroll from '../components/Scroll';
import ErrorBoundry from '../components/ErrorBoundry';
import './App.css';

function App() {
    // constructor() {
    //     super()
    //     this.state = {
    //         robots: [],
    //         searchfield: ''
    //     }
    // }
    const [ robots, setRobots ] = useState([]) //use state returns a piece of state and function that changes that state. (pass initial value of state variable, in this case empty array.)
    const [ searchfield, setSearchfield ] = useState('')
    const [ count, setCount ] = useState(0 )
    // componentDidMount() {
    //     fetch('https://jsonplaceholder.typicode.com/users')
    //         .then(response => response.json())
    //         .then(users => this.setState({ robots: users }))

    // }
useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(users => {setRobots(users)})
       
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
                <div className='tc'>
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

            );
        }
    

}

export default App