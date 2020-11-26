import {ONBOARDING_SCREENS} from "../screens/onboarding";

export type RootNavigatorScreens = {
    MainScreen: undefined;
    LoginScreen: undefined;
    ForgotPasswordEmailSentScreen: undefined;
    ValidationEmailSentScreen: undefined;
    ValidateEmailScreen: undefined;
    ResetPasswordScreen: undefined;
    ResetPasswordSuccessScreen: undefined;
    OnboardingScreen: undefined;
    OnboardingSuccessfulScreen: undefined;
    MatchSuccessScreen: undefined;
    NotFoundScreen: undefined;
};

export type MainNavigatorTabs = {
    TabHome: undefined;
    TabMatching: undefined;
    TabMessaging: undefined;
    TabProfile: undefined;
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
};

// TAB: Messaging

export type TabMessagingRoot = {
    ChatScreen: undefined;
    MessagingScreen: undefined;
};

export type TabMessagingTabs = {
    IndividualMessagingTab: undefined;
    GroupMessagingTab: undefined;
};

// TAB: Profile

export type TabProfileRoot = {
    TabProfileScreen: undefined;
};

// TAB: Notifications

export type TabNotificationsRoot = {
    TabNotificationsScreen: undefined;
};

// Login screen

export type TabLoginRoot = {
    TabSignin: undefined;
    TabSignup: undefined;
};

export type TabLoginSigninScreens = {
    LoginForm: undefined;
    ForgotPassword: undefined;
};

// Onboarding

export type OnboardingScreens = typeof ONBOARDING_SCREENS;

export type NavigatorRoute =
    | keyof RootNavigatorScreens
    | keyof MainNavigatorTabs
    | keyof TabHomeRoot
    | keyof TabLoginRoot
    | keyof TabMatchingRoot
    | keyof TabNotificationsRoot
    | keyof TabProfileRoot
    | keyof TabLoginSigninScreens
    | keyof OnboardingScreens
    | keyof TabMessagingTabs;
