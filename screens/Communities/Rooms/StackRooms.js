import { createStackNavigator } from 'react-navigation-stack'
import RoomsList from './RoomsList'
import CreateRoom from './CreateRoom'
import ChooseRoomMembers from './ChooseRoomMembers'
import RoomMembers from './RoomMembers'
import ChatScreen from './ChatScreen'
import BubbleStack from './Bubble/StackBubble'
import UploadedMediaStack from './UploadedMedia/StackUploadedMedia'

const roomsStack = createStackNavigator(
    {
        RoomsList,
        CreateRoom,
        ChooseRoomMembers,
        RoomMembers,
        ChatScreen,
        UploadedMediaStack,
        BubbleStack
    },
    {
        headerMode: 'none'
    }
)

export default roomsStack

