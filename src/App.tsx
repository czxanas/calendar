import Calendar from "./components/Calendar"
import Navbar from "./components/Navbar"

const App = () => {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden grid grid-rows-[auto_1fr]">
      <Navbar />
      <section className="relative container h-[200vh] flex items-center justify-center">
        <Calendar />
      </section>
    </main>
  )
}

export default App
