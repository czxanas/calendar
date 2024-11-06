import Calendar from "./components/Calendar"
import Navbar from "./components/Navbar"

const App = () => {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden grid grid-rows-[auto_1fr]">
      <Navbar />
      <section className="relative container h-full overflow-hidden flex flex-col items-center justify-center">
        <Calendar />
      </section>
    </main>
  )
}

export default App
