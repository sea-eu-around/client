import {ONBOARDING_SCREENS} from "../screens/onboarding";

export type RootNavigatorScreens = {
    MainScreen: undefined;
    LoginScreen: undefined;
    ValidationEmailSentScreen: undefined;
    ValidateEmailScreen: undefined;
    OnboardingScreen: undefined;
    OnboardingSuccessfulScreen: undefined;
    MatchSuccessScreen: undefined;
    NotFoundScreen: undefined;
};

export type MainNavigatorTabs = {
    TabDiscover: undefined;
    TabMatching: undefined;
    TabMessaging: undefined;
    TabProfile: undefined;
    TabNotifications: undefined;
};

export type LoginNavigatorTabs = {
    TabLogin: undefined;
    TabSignup: undefined;
};

export type MessagingNavigatorRoot = {
    ChatScreen: undefined;
    MessagingScreen: undefined;
};

export type MessagingNavigatorTabs = {
    IndividualMessagingTab: undefined;
    GroupMessagingTab: undefined;
};

export type LoginTabNavigatorScreens = {
    LoginForm: undefined;
    ForgotPassword: undefined;
} & RootNavigatorScreens;

export type OnboardingScreens = typeof ONBOARDING_SCREENS;

export type SignupTabNavigatorScreens = {
    SignupForm: undefined;
};

export type TabDiscoverParamList = {
    TabDiscoverScreen: undefined;
};

export type TabMatchingParamList = {
    TabMatchingScreen: undefined;
    MatchFilteringScreen: undefined;
};

export type TabNotificationsParamList = {
    TabNotificationsScreen: undefined;
};

export type TabProfileParamList = {
    TabProfileScreen: undefined;
};

export type NavigatorRoute =
    | keyof RootNavigatorScreens
    | keyof MainNavigatorTabs
    | keyof LoginNavigatorTabs
    | keyof TabMatchingParamList
    | LoginTabNavigatorScreens
    | OnboardingScreens;
