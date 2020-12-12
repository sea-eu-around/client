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

        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                style={{flex: 1, width: "100%"}}
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
                    style={{
                        flex: 1,
                        width: "75%",
                        maxWidth: 300,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {this.props.children}
                </KeyboardAvoidingView>
            </ScrollView>
        );
    }
}

export default withTheme(ScrollFormWrapper);
