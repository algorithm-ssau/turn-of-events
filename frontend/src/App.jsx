import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header'
import Events from './components/Events/Events'
import UpcomingEvents from './components/UpcomingEvents/UpcomingEvents'
import EventDetails from './components/EventDetails/EventDetails'
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
      <Header />
        <Routes>
          <Route path="/" element={
      <div className="event-container">
        <UpcomingEvents title="Ближайшие мероприятия" count={100} />
        <Events title="Все мероприятия" count={9} />
      </div>
          } />
          <Route path="/event/:id" element={<EventDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App