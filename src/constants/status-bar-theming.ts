import {NavigatorRoute} from "../navigation/types";
import {ThemeKey} from "../types";

// TODO add status bar theme overrides
// Override the status bar theme for certain screens
export const STATUS_BAR_THEME_OVERRIDES: {[key in NavigatorRoute]?: ThemeKey} = {
    LoginScreen: "light",
    SignupScreen: "light",
    ForgotPasswordScreen: "light",
};
