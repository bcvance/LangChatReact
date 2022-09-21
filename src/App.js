import logo from './logo.svg';
import './App.css';
import Sidebar from './screens/Sidebar';
import ConversationsProvider from './contexts/ConversationsProvider'
import ContactsProvider from './contexts/ContactsProvider'

function App() {
  return (
    <div className="App">
      <div className='d-flex' style={{ height: '100vh'}}>
        {/* <ConversationsProvider>
          <ContactsProvider> */}
            <Sidebar />
          {/* </ContactsProvider>
        </ConversationsProvider> */}
      </div>
    </div>
  );
}

export default App;
