export type Theme = "light" | "dark";

export type FormProps<T> = {
    onSuccessfulSubmit?: (values: T) => void;
};

export type RootNavigatorScreens = {
    MainScreen: undefined;
    LoginScreen: undefined;
    NotFoundScreen: undefined;
};

export type LoginTabNavigatorScreens = {
    LoginForm: undefined;
    ForgotPassword: undefined;
} & RootNavigatorScreens;

export type SignupTabNavigatorScreens = {
    SignupForm: undefined;
};

export type MainNavigatorTabs = {
    TabOne: undefined;
    TabTwo: undefined;
};

export type TabOneParamList = {
    TabOneScreen: undefined;
};

export type TabTwoParamList = {
    TabTwoScreen: undefined;
};
