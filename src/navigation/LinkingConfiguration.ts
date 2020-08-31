import * as Linking from "expo-linking";

export default {
    prefixes: [Linking.makeUrl("/")],
    config: {
        screens: {
            LoginScreen: {
                screens: {
                    login: {
                        screens: {
                            LoginForm: "login",
                            ForgotPassword: "forgot-password",
                        },
                    },
                    signup: {
                        screens: {
                            SignupForm: "signup",
                        },
                    },
                },
            },
            RootScreen: {
                screens: {
                    TabOne: {
                        screens: {
                            TabOneScreen: "one",
                        },
                    },
                    TabTwo: {
                        screens: {
                            TabTwoScreen: "two",
                        },
                    },
                },
            },
            NotFoundScreen: "*",
        },
    },
};
