import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Testimonials from './sections/Testimonials';
import BlogPreview from './sections/BlogPreview';
import Contact from './sections/Contact';
import Blog from './routes/Blog';
import BlogPost from './routes/BlogPost';
import { AnimationDemo } from './routes/AnimationDemo';

function Home() {
  useSmoothScroll();

  return (
    <>
      <Hero enableThreeJS={false} />
      <About />
      <Services />
      <Projects />
      <Experience />
      <Testimonials />
      <BlogPreview />
      <Contact />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/animation-demo" element={<AnimationDemo />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <CustomCursor />
        <Header />
        <AppRoutes />
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
