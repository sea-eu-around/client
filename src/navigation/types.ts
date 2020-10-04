export type RootNavigatorScreens = {
    MainScreen: undefined;
    LoginScreen: undefined;
    ValidationEmailSentScreen: undefined;
    ValidateEmailScreen: undefined;
    OnboardingScreen: undefined;
    NotFoundScreen: undefined;
};

export type MainNavigatorTabs = {
    TabDiscover: undefined;
    TabMatching: undefined;
    TabMessaging: undefined;
    TabNotifications: undefined;
    TabProfile: undefined;
};

export type LoginTabNavigatorScreens = {
    LoginForm: undefined;
    ForgotPassword: undefined;
} & RootNavigatorScreens;

export type OnboardingScreens = {
    OnboardingNameScreen: undefined;
    OnboardingPersonalInfoScreen: undefined;
    OnboardingRoleScreen: undefined;
    OnboardingDiscoverScreen: undefined;
    OnboardingMeetScreen: undefined;
    OnboardingCollaborateScreen: undefined;
    OnboardingTosScreen: undefined;
};

export type SignupTabNavigatorScreens = {
    SignupForm: undefined;
};

export type TabDiscoverParamList = {
    TabDiscoverScreen: undefined;
};

export type TabMatchingParamList = {
    TabMatchingScreen: undefined;
};

export type TabMessagingParamList = {
    TabMessagingScreen: undefined;
};

export type TabNotificationsParamList = {
    TabNotificationsScreen: undefined;
};

export type TabProfileParamList = {
    TabProfileScreen: undefined;
};
