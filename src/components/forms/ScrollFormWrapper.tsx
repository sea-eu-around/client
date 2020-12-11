import * as React from "react";
import {ScrollView, LayoutChangeEvent, StyleProp, ViewStyle, Keyboard, KeyboardAvoidingView} from "react-native";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";

type ScrollFormWrapperProps = ThemeProps & {contentStyle?: StyleProp<ViewStyle>};

type ScrollFormWrapperState = {height: number};

// TODO clean-up
class ScrollFormWrapper extends React.Component<ScrollFormWrapperProps, ScrollFormWrapperState> {
    keyboardShown = false;

    constructor(props: ScrollFormWrapperProps) {
        super(props);
        this.state = {height: 0};
    }

    componentDidMount() {
        Keyboard.addListener("keyboardDidShow", () => {
            /*const coords = e.endCoordinates;
            console.log(coords);
            if (coords) this.setState({...this.state, height: coords.height, keyboardTopY: coords.screenY, keyboardOpen: true});*/
            this.keyboardShown = true;
        });
        Keyboard.addListener("keyboardDidHide", () => (this.keyboardShown = false));
    }

    render(): JSX.Element {
        //const {theme} = this.props;
        const {height} = this.state;
        //const styles = loginTabsStyles(theme);

        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{flex: 1}}
                contentContainerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: height,
                }}
                onLayout={(e: LayoutChangeEvent) => {
                    if (!this.keyboardShown) this.setState({...this.state, height: e.nativeEvent.layout.height});
                }}
            >
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{flex: 1, justifyContent: "center", alignItems: "center", width: "100%"}}
                >
                    {this.props.children}
                </KeyboardAvoidingView>
            </ScrollView>
        );
        /*return (
            <ScrollView
                style={{backgroundColor: "red"}}
                contentContainerStyle={{
                    paddingTop: 50,
                    //justifyContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                    {this.props.children}
            </ScrollView>
        );*/
    }
}

/*
<KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "height" : "position"}
    style={{flex: 1, backgroundColor: "green", paddingBottom: 0, marginBottom: 0}}
    contentContainerStyle={{flex: 1, height: "100%", backgroundColor: "red", paddingBottom: 0, marginBottom: 0}}
    //keyboardVerticalOffset={100}
>
*/

export default withTheme(ScrollFormWrapper);
