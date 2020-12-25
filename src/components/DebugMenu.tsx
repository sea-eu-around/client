import {FontAwesome} from "@expo/vector-icons";
import * as React from "react";
import {TouchableOpacity, Platform} from "react-native";
import {BottomSheet, ListItem, withTheme} from "react-native-elements";
import {rootNavigate} from "../navigation/utils";
import {debugConnect} from "../state/auth/actions";
import store from "../state/store";
import {MyThunkDispatch} from "../state/types";
import {ThemeProps} from "../types";
import CustomModal from "./modals/CustomModal";

type DebugMenuProps = ThemeProps;
type DebugMenuState = {visible: boolean};

class DebugMenu extends React.Component<DebugMenuProps, DebugMenuState> {
    ACTIONS = [
        {
            title: "Access MainScreen",
            onPress: () => {
                rootNavigate("MainScreen");
                this.hide();
            },
        },
        {
            title: "Access OnBoardingScreen",
            onPress: () => {
                rootNavigate("OnboardingScreen");
                this.hide();
            },
        },
        {
            title: "Automatically create profile",
            onPress: () => {
                (store.dispatch as MyThunkDispatch)(debugConnect());
                this.hide();
            },
        },
        {
            title: "Hide",
            containerStyle: {backgroundColor: "red"},
            titleStyle: {color: "white"},
            onPress: () => this.hide(),
        },
    ];

    constructor(props: DebugMenuProps) {
        super(props);
        this.state = {visible: false};
    }

    show() {
        this.setState({...this.state, visible: true});
    }

    hide() {
        this.setState({...this.state, visible: false});
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const {visible} = this.state;

        const debugContent = (
            <>
                <ListItem>
                    <ListItem.Content>
                        <ListItem.Title style={{fontSize: 26, marginBottom: 10, color: theme.text}}>
                            Debug Menu
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                {this.ACTIONS.map((l, i) => (
                    <ListItem key={`debug-action-${i}`} containerStyle={l.containerStyle} onPress={l.onPress}>
                        <ListItem.Content>
                            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </>
        );

        return (
            <>
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        bottom: 50,
                        right: 10,
                        width: 36,
                        height: 36,
                        backgroundColor: theme.error,
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={() => this.show()}
                >
                    <FontAwesome name="gear" color="white" style={{fontSize: 26}} />
                </TouchableOpacity>
                {Platform.OS !== "web" && (
                    <BottomSheet modalProps={{statusBarTranslucent: true}} isVisible={visible}>
                        {debugContent}
                    </BottomSheet>
                )}
                {Platform.OS === "web" && (
                    <CustomModal visible={visible} onHide={() => this.hide()} renderContent={() => debugContent} />
                )}
            </>
        );
    }
}

export default withTheme(DebugMenu);
