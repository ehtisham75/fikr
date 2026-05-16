import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import ROUTES from '../utils/routes';
import HomeScreen from '../screens/home/HomeScreen';
import BudgetScreen from '../screens/home/BudgetScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigation() {

    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
            <Tab.Screen name={ROUTES.BUDGET} component={BudgetScreen} />
            <Tab.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
        </Tab.Navigator>
    );
}

