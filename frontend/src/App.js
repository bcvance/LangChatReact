import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from 'react-bootstrap';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ConversationsProvider from './contexts/ConversationsProvider'
import ContactsProvider from './contexts/ContactsProvider'
import UserProvider from './contexts/UserProvider'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <UserProvider>
      <ConversationsProvider>
            <ContactsProvider>
              <Router>
                <Routes>
                  <Route path='/' element={
                    <ProtectedRoute>
                      <HomeScreen />
                    </ProtectedRoute>
                  } exact />
                  <Route path='/login/' element={<LoginScreen />}/>
                </Routes>
              </Router>
            </ContactsProvider>
        </ConversationsProvider>
    </UserProvider>
  );
}

export default App;
