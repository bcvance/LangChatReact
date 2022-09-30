import React from 'react'
import TopNav from './TopNav'

function ConversationPanel() {
  return (
    <div style={{ height: '100vh'}} className='d-flex flex-grow-1 flex-column'>
        <TopNav />
        <div style={{ height: '100vh'}} className='d-flex flex-column'>ConversationPanel</div>
    </div>
    
  )
}

export default ConversationPanel