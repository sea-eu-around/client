import {NavigatorRoute} from "../navigation/types";
import {ThemeKey} from "../types";

// Override the status bar theme for certain screens
export const STATUS_BAR_THEME_OVERRIDES: {[key in NavigatorRoute]?: ThemeKey} = {
    SigninScreen: "light",
    SignupScreen: "light",
    ForgotPasswordScreen: "light",
    ProfileScreen: "light",
    MyProfileScreen: "light",
};
