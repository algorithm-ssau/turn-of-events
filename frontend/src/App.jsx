import './App.css'
import Header from './components/Header/Header'
import Events from './components/Events/Events'

function App() {
  return (
    <>
      <Header />
      <div className="event-container">
        <Events title="Ближайшие мероприятия" count={3} />
        <Events title="Все мероприятия" count={6} />
      </div>
    </>
  )
}

export default App