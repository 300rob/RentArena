import { useChatStore } from "../stores/useChatStore"
import ChatContainer from "../components/ChatContainer"
import Sidebar from '../components/MessageSidebar'
import NoChatSelected from "../components/NoChatSeleted"

const MessagesHomePage = () => {
const {selectedUser} = useChatStore()

return (
    <div className="chat-homepage">
        <Sidebar className="sidebar"/>
        <div className="chat-area">
        {!selectedUser ? <NoChatSelected/> : <ChatContainer/>}
        </div>
    </div>
)
}
export default MessagesHomePage