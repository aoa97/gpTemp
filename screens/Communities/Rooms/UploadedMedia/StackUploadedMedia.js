import { createSwitchNavigator } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import Media from './MediaList'
import ImageView from './ViewImage'
import VideoView from './ViewVideo'
import Links from './LinksList'

const switchNavigator = createSwitchNavigator(
    {
        Media,
        ImageView: {
            screen: ImageView,
            navigationOptions: {
                header: null,
            }
        },
        VideoView: {
            screen: VideoView,
            navigationOptions: {
                header: null,
            }
        }
    },
    {
        headerMode: 'none',
        navigationOptions: {
            tabBarVisible: true
        }
    },
)

const tabNavigator = createBottomTabNavigator({
    Media: switchNavigator,
    Links,
})

switchNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};

export default tabNavigator