import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import QuickLinks from "./components/QuickLinks";
import Countdown from "./components/Countdown";
import StoryTimeline from "./components/StoryTimeline";
import Gallery from "./components/Gallery";
import LoveNotes from "./components/ LoveNotes";
import SongSection from "./components/SongSection";
import Closing from "./components/Closing";
import Footer from "./components/Footer";
import MemoryPage from "./pages/MemoryPage";
import AlbumsPage from "./pages/AlbumsPage";
import AlbumDetailPage from "./pages/AlbumDetailPage";

import "./styles/App.css";

function HomePage() {
  return (
    <>
      <Hero />
      <QuickLinks />
      <Countdown />
      <StoryTimeline />
      <Gallery />
      <LoveNotes />
      <SongSection />
      <Closing />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="site">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/memories/:slug"
              element={<MemoryPage />}
            />
            <Route 
            path="/albums" 
            element={<AlbumsPage />} />
            <Route 
            path="/albums/:albumId" 
            element={<AlbumDetailPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;