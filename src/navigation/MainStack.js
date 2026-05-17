import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from '../screens/welcome/SplashScreen'
import WelcomeScreen from '../screens/welcome/WelcomeScreen'
import SignInScreen from '../screens/auth/SignInScreen'
import SignUpScreen from '../screens/auth/SignUpScreen'
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen'
import ROUTES from '../utils/routes'
import BottomTabNavigation from './BottomTabNavigation'
import AddNewFolderScreen from '../screens/home/AddNewFolderScreen'
import AddNewTaskScreen from '../screens/home/AddNewTaskScreen'
import TodayTasksScreen from '../screens/home/TodayTasksScreen'

const Stack = createNativeStackNavigator()

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.SPLASH}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}>
      <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
      <Stack.Screen name={ROUTES.SIGN_IN} component={SignInScreen} />
      <Stack.Screen name={ROUTES.SIGN_UP} component={SignUpScreen} />
      <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
      <Stack.Screen name={ROUTES.HOME} component={BottomTabNavigation} />
      <Stack.Screen name={ROUTES.ADD_NEW_FOLDER} component={AddNewFolderScreen} />
      <Stack.Screen name={ROUTES.ADD_NEW_TASK} component={AddNewTaskScreen} />
      <Stack.Screen name={ROUTES.TODAY_TASKS} component={TodayTasksScreen} />
    </Stack.Navigator>
  )
}

export default MainStack
