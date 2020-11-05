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

export type LoginNavigatorTabs = {
    TabLogin: undefined;
    TabSignup: undefined;
};

export type LoginTabNavigatorScreens = {
    LoginForm: undefined;
    ForgotPassword: undefined;
} & RootNavigatorScreens;

export type OnboardingScreens = {
    OnboardingNameScreen: undefined;
    OnboardingPersonalInfoScreen: undefined;
    OnboardingLanguageScreen: undefined;
    OnboardingInterestsScreen: undefined;
    OnboardingRoleScreen: undefined;
    OnboardingRoleSpecificScreen1: undefined;
    OnboardingRoleSpecificScreen2: undefined;
    OnboardingOffersScreen1: undefined;
    OnboardingOffersScreen2: undefined;
    OnboardingOffersScreen3: undefined;
    OnboardingTosScreen: undefined;
    OnboardingPrivacyScreen: undefined;
};

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

export type TabMessagingParamList = {
    TabMessagingScreen: undefined;
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
    | LoginTabNavigatorScreens
    | OnboardingScreens;
