import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./components/UI/About";
import Hero from "./components/UI/Hero";
import NavBar from "./components/UI/Navbar";
import Places from "./components/UI/Places";
import Contact from "./components/UI/Contact";
import Footer from "./components/UI/Footer";
import ScenePage from "./components/UI/ScenePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main landing page route */}
        <Route
          path="/"
          element={
            <main className="relative min-h-screen w-screen overflow-x-hidden">
              <NavBar />
              <Hero />
              <About />
              <Places />
              <Contact />
              <Footer />
            </main>
          }
        />
        {/* Dynamic route for scene pages */}
        <Route path="/:sceneName" element={<ScenePage />} />
      </Routes>
    </Router>
  );
}

export default App;
