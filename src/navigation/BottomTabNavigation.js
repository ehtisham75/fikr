import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import ROUTES from '../utils/routes';
import HomeScreen from '../screens/home/HomeScreen';
import TasksScreen from '../screens/home/TasksScreen';
import BudgetScreen from '../screens/home/BudgetScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator();

const renderTabBar = props => <CustomTabBar {...props} />;

export default function BottomTabNavigation() {

    return (
        <Tab.Navigator
            tabBar={renderTabBar}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
            <Tab.Screen name={ROUTES.TASKS} component={TasksScreen} />
            <Tab.Screen name={ROUTES.BUDGET} component={BudgetScreen} />
            <Tab.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
        </Tab.Navigator>
    );
}
