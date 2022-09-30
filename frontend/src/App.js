import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from 'react-bootstrap';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ConversationsProvider from './contexts/ConversationsProvider'
import ContactsProvider from './contexts/ContactsProvider'
import UserProvider from './contexts/UserProvider'
import { useEffect } from 'react';

function App() {
  return (
    <ConversationsProvider>
            <ContactsProvider>
              <UserProvider>
              <Router>
                <Routes>
                  <Route path='/' element={<HomeScreen />} exact />
                  <Route path='/login/' element={<LoginScreen />}/>
                </Routes>
              </Router>
              </UserProvider>
            </ContactsProvider>
        </ConversationsProvider>
  );
}

export default App;
