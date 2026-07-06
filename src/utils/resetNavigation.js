import { CommonActions } from '@react-navigation/native';

const resetNavigation = (navigation, screenName) => {
    return (
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: screenName }],
            })
        )
    )
}

export default resetNavigation