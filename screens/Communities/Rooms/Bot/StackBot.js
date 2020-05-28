import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LaunchBot from './launchBot'
import Room from './start'
import ChatBot_Chat from './ChatBot_Chat'
import commandList from "./commandList";
import chatBot from './ChatSimple'
import LogIn from './LogIn'
import SecondPageLaunch from './SecondPageLaunch'
import FlatListRender from './FlatListRender'
import queryExample from './queryExample'

const botStack = createStackNavigator({
  LogIn: { screen: LogIn },
  Room: { screen: Room },
  launchBot: { screen: LaunchBot },
  SecondPageLaunch : {screen : SecondPageLaunch},
  commandList: { screen: commandList },
  chatBot: { screen: chatBot },
  queryExample: {screen : queryExample}
});

export default createAppContainer(botStack);