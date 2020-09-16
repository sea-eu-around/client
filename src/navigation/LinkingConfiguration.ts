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
            MainScreen: {
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
                    TabProfile: {
                        screens: {
                            TabProfileScreen: "profile",
                        },
                    },
                },
            },
            NotFoundScreen: "*",
        },
    },
};
