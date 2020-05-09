import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Room from './start'
import Bubble from './Bubble'
import createBubble from "./createBubble";
import bubbleExtend from "./bubbleExtend";


const MainNavigator = createStackNavigator({
  Room: { screen: Room },
  createBubble: {screen: createBubble},
  Bubble: { screen: Bubble },
  bubbleExtend: {screen: bubbleExtend}, 
});

export default MainNavigator;
