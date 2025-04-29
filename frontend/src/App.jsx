import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header/Header'
import Events from './components/Events/Events'
import UpcomingEvents from './components/UpcomingEvents/UpcomingEvents'
import {User} from './User';

function App() {
  return (
    <>
      <Header />
      <div className="event-container">
        <UpcomingEvents title="Ближайшие мероприятия" count={10} />
        <Events title="Все мероприятия" count={9} />
      </div>
    </>
  )
}

export default App