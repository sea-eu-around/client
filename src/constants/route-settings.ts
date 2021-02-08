import {NavigatorRoute} from "../navigation/types";
import {ONBOARDING_ORDER} from "../screens/onboarding";
import {ThemeKey} from "../types";

// The navigation routes that require a connection to the chat socket.
export const CHAT_CONNECTED_ROUTES: NavigatorRoute[] = ["ChatScreen", "ChatRoomsScreen"];

// Override the status bar theme for certain screens
export const STATUS_BAR_THEME_OVERRIDES: {[key in NavigatorRoute]?: ThemeKey} = {
    SigninScreen: "light",
    SignupScreen: "light",
    ForgotPasswordScreen: "light",
    ProfileScreen: "light",
    MyProfileScreen: "light",
    GroupScreen: "light",
};

// Routes that will redirect when not authenticated
export const AUTHENTICATED_ROUTES: NavigatorRoute[] = ([
    "ChatRoomsScreen",
    "ChatScreen",
    "DeleteAccountScreen",
    "MainScreen",
    "MatchFilteringScreen",
    "MatchHistoryScreen",
    "MyProfileScreen",
    "OnboardingSuccessfulScreen",
    "ProfileScreen",
    "SettingsScreen",
    "TabHome",
    "TabHomeScreen",
    "TabMatching",
    "TabMatchingScreen",
    "TabMessaging",
    "TabNotifications",
    "TabNotificationsScreen",
] as NavigatorRoute[]).concat(ONBOARDING_ORDER);
