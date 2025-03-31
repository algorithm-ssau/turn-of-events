import './App.css'
import Header from './components/Header/Header'
import Events from './components/Events/Events'

import {User} from './User';

function App() {
  return (
    <>
    <Router>
      <Header />
      <div className="event-container">
        <switch>
          <Route path="/user" component={User} />
        </switch>
        <Events title="Ближайшие мероприятия" count={3} />
        <Events title="Все мероприятия" count={6} />
      </div>
    </Router>
    </>
  )
}

export default App