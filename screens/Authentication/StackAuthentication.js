import { createStackNavigator } from 'react-navigation-stack'
import SignIn from './SignIn'
import SignUp from './SignUp'
import VerifyEmail from './VerifyEmail'
import ForgotPassword from './ForgotPassword'

const authStack = createStackNavigator(
    {
        SignIn,
        VerifyEmail,
        SignUp,
        ForgotPassword,
        //SetNewPassword,
    },
    {
        headerMode: 'none'
    }
)

export default authStack