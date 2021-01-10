import {ONBOARDING_SCREENS} from "../screens/onboarding";

export type RootNavigatorScreens = {
    MainScreen: undefined;
    LoginRoot: undefined;
    ForgotPasswordEmailSentScreen: undefined;
    ValidationEmailSentScreen: undefined;
    ValidateEmailScreen: undefined;
    ResetPasswordScreen: undefined;
    ResetPasswordSuccessScreen: undefined;
    DeleteAccountScreen: undefined;
    DeleteAccountSuccessScreen: undefined;
    MyProfileScreen: undefined;
    ProfileScreen: undefined;
    SettingsScreen: undefined;
    OnboardingScreen: undefined;
    OnboardingSuccessfulScreen: undefined;
    NotFoundScreen: undefined;
};

export type MainNavigatorTabs = {
    TabHome: undefined;
    TabMatching: undefined;
    TabMessaging: undefined;
    TabNotifications: undefined;
};

// TAB: Home

export type TabHomeRoot = {
    TabHomeScreen: undefined;
};

// TAB: Matching

export type TabMatchingRoot = {
    TabMatchingScreen: undefined;
    MatchFilteringScreen: undefined;
    MatchHistoryScreen: undefined;
};

// TAB: Messaging

export type TabMessagingRoot = {
    ChatRoomsScreen: undefined;
    ChatScreen: undefined;
};

// TAB: Notifications

export type TabNotificationsRoot = {
    TabNotificationsScreen: undefined;
};

// Login screen

export type LoginRoot = {
    WelcomeScreen: undefined;
    LoginScreens: undefined;
};

export type LoginScreens = {
    ForgotPasswordScreen: undefined;
    SigninScreen: undefined;
    SignupScreen: undefined;
};

// Onboarding

export type OnboardingScreens = typeof ONBOARDING_SCREENS;

export type NavigatorRoute =
    | keyof RootNavigatorScreens
    | keyof LoginRoot
    | keyof LoginScreens
    | keyof MainNavigatorTabs
    | keyof TabHomeRoot
    | keyof TabMatchingRoot
    | keyof TabMessagingRoot
    | keyof TabNotificationsRoot
    | keyof OnboardingScreens;
