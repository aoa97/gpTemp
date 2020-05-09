import { createStackNavigator } from 'react-navigation-stack'
import CommunitiesList from './CommunitesList'
import CreateCommunity from './CreateCommunity'
import ChooseMembers from './ChooseMembers'
import CommunityOverview from './CommunityOverview'
import CommunityMembers from './CommunityMembers'
import CreatePost from './CreatePost'
import EditPost from './EditPost'
import CommunityRooms from './Rooms/StackRooms'

const communitiesStack = createStackNavigator(
    {
        CommunitiesList,
        CommunityOverview,
        CreateCommunity,
        ChooseMembers,
        CommunityMembers,
        CommunityRooms,
        CreatePost,
        EditPost
    },
    {
        headerMode: 'none'
    }
)
export default communitiesStack

