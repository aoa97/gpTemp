import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import AuthStack from './screens/Authentication/StackAuthentication'
import CommunitiesStack from './screens/Communities/StackCommunities'
import AccountsStack from './screens/Accounts/StackAccounts'
import NewsFeed from './screens/NewsFeed'
import Welcome from './screens/Welcome'
import Play from './screens/PlayScreen'

const appStack = createStackNavigator(
    {
        // Welcome,
        // Play,
        AuthStack,
        AccountsStack,
        CommunitiesStack,
        NewsFeed,
    },
    {
        headerMode: 'none'
    }
)

export default createAppContainer(appStack)