import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import AppRouter from "./routes/AppRouter";


function App() {
  return (
    <div className="app">
      <Header />
      <Navigation />
      <main className="main-content">
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
}

export default App;