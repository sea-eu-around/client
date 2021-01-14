import * as React from "react";
import {ScrollView, LayoutChangeEvent, StyleProp, ViewStyle, Keyboard, KeyboardAvoidingView} from "react-native";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";

type ScrollFormWrapperProps = ThemeProps & {contentStyle?: StyleProp<ViewStyle>; notKeyboardReactive?: boolean};

type ScrollFormWrapperState = {height: number};

class ScrollFormWrapper extends React.Component<ScrollFormWrapperProps, ScrollFormWrapperState> {
    keyboardShown = false;

    constructor(props: ScrollFormWrapperProps) {
        super(props);
        this.state = {height: 0};
    }

    componentDidMount() {
        if (!this.props.notKeyboardReactive) {
            Keyboard.addListener("keyboardDidShow", () => {
                /*const coords = e.endCoordinates;
                console.log(coords);
                if (coords) this.setState({...this.state, height: coords.height, keyboardTopY: coords.screenY, keyboardOpen: true});*/
                this.keyboardShown = true;
            });
            Keyboard.addListener("keyboardDidHide", () => (this.keyboardShown = false));
        }
    }

    render(): JSX.Element {
        const {notKeyboardReactive, contentStyle, theme} = this.props;
        const {height} = this.state;

        const styles = themedStyles(theme);

        return (
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollViewContent,
                    {
                        minHeight: notKeyboardReactive ? 0 : height,
                    },
                ]}
                onLayout={(e: LayoutChangeEvent) => {
                    if (!notKeyboardReactive || this.state.height == 0) {
                        // Manually give a minimum height to the content
                        // (-5 is to prevent an unnecessary scrollbar from showing on web)
                        if (!this.keyboardShown)
                            this.setState({...this.state, height: e.nativeEvent.layout.height - 5});
                    }
                }}
            >
                <KeyboardAvoidingView
                    behavior="padding"
                    style={[
                        styles.keyboardAvoidingView,
                        // Avoid showing the content until we have the height computed
                        !notKeyboardReactive && this.state.height === 0 ? {opacity: 0} : {},
                        contentStyle,
                    ]}
                >
                    {this.props.children}
                </KeyboardAvoidingView>
            </ScrollView>
        );
    }
}

const themedStyles = preTheme(() => ({
    keyboardAvoidingView: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    scrollView: {
        flex: 1,
        width: "100%",
    },
    scrollViewContent: {
        justifyContent: "center",
        alignItems: "center",
    },
}));

export default withTheme(ScrollFormWrapper);
