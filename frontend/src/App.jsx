import Home from "./pages/Home";
import Auth from "./pages/Auth";

function App() {
  if (window.location.pathname === "/auth") {
    return <Auth />;
  }

  return <Home />;
}

export default App;