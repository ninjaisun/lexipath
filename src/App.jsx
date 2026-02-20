import { useState, useEffect } from 'react';
import { StudyView } from './agents/StudyView'
import { AuthView } from './agents/AuthView'

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('lexipath_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticate = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('lexipath_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('lexipath_user');
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <StudyView onLogout={handleLogout} />
      ) : (
        <AuthView onAuthenticate={handleAuthenticate} />
      )}
    </div>
  )
}

export default App
