import React from "react";
import {TextStyle, StyleProp, View, TextInput, ViewStyle, TouchableOpacity, StyleSheet} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";

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

class CommentTextInput extends React.Component<CommentTextInputProps, CommentTextInputState> {
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
                <>
                    <TouchableOpacity
                        style={styles.inputButton}
                        onPress={() => {
                            if (onSend) onSend(value);
                        }}
                    >
                        <MaterialIcons name={"send"} style={styles.inputButtonIcon} />
                    </TouchableOpacity>
                </>
            );

        return (
            <View style={[styles.wrapper, {height}, style, this.state.focused ? focusedStyle : {}]}>
                <TextInput
                    ref={this.inputRef}
                    style={[
                        styles.input,
                        inputStyle,
                        this.state.focused ? inputFocusedStyle : {},
                        // untouched ? {} : error ? errorStyle : value.length > 0 ? validStyle : {},
                    ]}
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

export default withTheme(CommentTextInput);
