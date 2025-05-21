import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-pink-500 to-cyan-500">
      <Navbar />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}