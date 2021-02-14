import React from "react";
import {TextStyle, StyleProp, View, TextInput, ViewStyle, StyleSheet} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import Button from "./Button";

export type CommentTextInputProps = {
    style?: StyleProp<ViewStyle>;
    focusedStyle?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>;
    inputFocusedStyle?: StyleProp<TextStyle>;
    placeholderTextColor?: string;
    onSend?: (text: string) => void;
} & ThemeProps;

type CommentTextInputState = {
    value: string;
    height: number;
    focused: boolean;
};

const MIN_HEIGHT = 40;

export class CommentTextInputClass extends React.Component<CommentTextInputProps, CommentTextInputState> {
    inputRef = React.createRef<TextInput>();

    constructor(props: CommentTextInputProps) {
        super(props);
        this.state = {focused: false, value: "", height: 0} as CommentTextInputState;
    }

    focus(): void {
        this.inputRef.current?.focus();
    }

    private onFocus(): void {
        return;
    }

    private onBlur(): void {
        return;
    }

    render(): JSX.Element {
        const {style, inputStyle, inputFocusedStyle, focusedStyle, placeholderTextColor, theme, onSend} = this.props;
        const {value} = this.state;
        const styles = themedStyles(theme);

        const height = Math.max(MIN_HEIGHT, this.state.height);

        const icons =
            value.length === 0 ? (
                <></>
            ) : (
                <Button
                    style={styles.inputButton}
                    onPress={() => onSend && onSend(value)}
                    icon={<MaterialIcons name={"send"} style={styles.inputButtonIcon} />}
                />
            );

        return (
            <View style={[styles.wrapper, {height}, style, this.state.focused ? focusedStyle : {}]}>
                <TextInput
                    ref={this.inputRef}
                    style={[styles.input, inputStyle, this.state.focused ? inputFocusedStyle : {}]}
                    onBlur={() => {
                        this.onBlur();
                        this.setState({focused: false});
                    }}
                    onFocus={() => {
                        this.onFocus();
                        this.setState({focused: true});
                    }}
                    multiline
                    numberOfLines={4}
                    value={value}
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={(value) => this.setState({...this.state, value})}
                    onContentSizeChange={(event) => {
                        if ((value.match(/\n/g) || []).length < 4)
                            this.setState({height: event.nativeEvent.contentSize.height});
                    }}
                />
                <View>{icons}</View>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
        },
        input: {
            paddingLeft: 20,
            paddingVertical: 10,
            flex: 1,
            height: "100%",
            backgroundColor: "transparent",
        },
        inputButton: {
            padding: 10,
        },
        inputButtonIcon: {
            fontSize: 24,
            color: theme.accent,
        },
    });
});

export default withTheme(CommentTextInputClass);
