import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from 'react-bootstrap';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { ProtectedRoute } from './components/ProtectedRoute'
import UsersProvider from './contexts/UserProvider';
import ConversationsProvider from './contexts/ConversationsProvider'
import ContactsProvider from './contexts/ContactsProvider'

function App() {
  return (
    <UsersProvider>
      <ConversationsProvider>
        <ContactsProvider>
          <Router>
            <Routes>
              <Route path='/' element={
                // <ProtectedRoute>
                  <HomeScreen />
                // </ProtectedRoute>
              } exact />
              <Route path='/login/' element={<LoginScreen />}/>
            </Routes>
          </Router>
        </ContactsProvider>
      </ConversationsProvider>
    </UsersProvider>
  );
}

export default App;
