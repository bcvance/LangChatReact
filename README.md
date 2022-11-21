**LangChat**
============

LangChat is a live chat client designed to make finding a compatible language partner fast and convenient. Code for this project can be found [here](https://github.com/bcvance/LangChatReact).

Features:
---------

*   Language partner matching based on user native and target language
*   Persistent chat instances and contacts
*   Individual and group chats
*   JSON Web Token authentication
*   Bidirectional client/server communication (Websockets)

Using the application:
----------------------

*   If you are a new user to LangChat, create an account, otherwise log in.
    
*   On login, you'll be greeted by the chat client shown below. Here you will have access to all of your chats and contacts, as well as the ability to match with new language partners and create new group chats with users in your contacts.
    
    ![alt text](https://github.com/bcvance/LangChatReact/blob/dev/backend/chat_api/readme_media/langchat_login.gif)

### Finding new language partners:

1.  While on the conversations tab, click "New Conversation" to display the new conversation interface.
    
2.  Select a language that you know and the language that you're learning, and press "find me a partner". Alternatively, start a conversation or group chat from your contacts.
    
3.  If there is an active user who knows the language you are learning who is learning the language that you know, LangChat will match you and create a chat instance. Otherwise, you will see "Finding partner..." until one is found or you cancel your search.
    
    ![alt text](https://github.com/bcvance/LangChatReact/blob/dev/backend/chat_api/readme_media/partner_match.gif)
4.  Save users to contacts by clicking on their username. Once in your contacts, users can be added to group chats.
    
    ![alt text](https://github.com/bcvance/LangChatReact/blob/dev/backend/chat_api/readme_media/save_contact.gif)

Stack/technology information:
-----------------------------
**Backend:**
* Django
    - Django Channels (Websocket functionality)
    - Django Signals (For notifying frontend of changes in the database)
* PostgreSQL
**Frontend**
* React
    - React Contexts (state management)
    - React Router
* React Bootstrap

In the works:
-------------

*   User profile pages
*   Profile pictures
*   Deployment
