import About from "./components/UI/About";
import Hero from "./components/UI/Hero";
import NavBar from "./components/UI/Navbar";
import Places from "./components/UI/Places";
import Contact from "./components/UI/Contact";
import Footer from "./components/UI/Footer";

function App() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <Hero />
      <About />
      <Places />
      <Contact />
      <Footer />
    </main>
  );
}

export default App;
