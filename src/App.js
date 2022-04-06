import { AuthProvider } from './store/auth-context';

import Header from './components/Layout/Header';
import './App.css';
import HomeFeed from './components/HomeFeed/HomeFeed';

import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Header />
        <Home />
      </AuthProvider>
    </div>
  );
}

export default App;
