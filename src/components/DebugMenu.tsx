import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import {TouchableOpacity} from "react-native";
import {withTheme} from "react-native-elements";
import {rootNavigate} from "../navigation/utils";
import {beginOnboarding, debugConnect} from "../state/auth/actions";
import store from "../state/store";
import {MyThunkDispatch} from "../state/types";
import {ThemeProps} from "../types";
import ActionMenu from "./ActionMenu";

export type DebugMenuProps = ThemeProps;

class DebugMenu extends React.Component<DebugMenuProps> {
    render(): JSX.Element {
        const {theme} = this.props;

        return (
            <ActionMenu
                title="Debug Menu"
                actions={[
                    {
                        text: "Access MainScreen",
                        onSelect: () => rootNavigate("MainScreen"),
                    },
                    {
                        text: "Access OnBoardingScreen",
                        onSelect: () => store.dispatch(beginOnboarding()),
                    },
                    {
                        text: "Automatically create profile",
                        onSelect: () => (store.dispatch as MyThunkDispatch)(debugConnect()),
                    },
                    {
                        preset: "close",
                    },
                ]}
                activator={(show) => (
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            bottom: 10,
                            right: 10,
                            width: 36,
                            height: 36,
                            backgroundColor: theme.error,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        onPress={show}
                    >
                        <FontAwesome name="gear" color="white" style={{fontSize: 26}} />
                    </TouchableOpacity>
                )}
            />
        );
    }
}

export default withTheme(DebugMenu);
