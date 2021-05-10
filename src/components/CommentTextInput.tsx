import React from "react";
import {StyleProp, View, TextInput, ViewStyle, StyleSheet, TextStyle, Platform} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import Button from "./Button";
import i18n from "i18n-js";
import {MAX_COMMENT_LENGTH, MIN_COMMENT_LENGTH} from "../validators";

export type CommentTextInputProps = {
    style?: StyleProp<ViewStyle>;
    onSend?: (text: string) => void;
} & ThemeProps;

type CommentTextInputState = {
    value: string;
    height: number;
    focused: boolean;
};

const MIN_HEIGHT = 40;
const MAX_HEIGHT = 100;

export class CommentTextInputClass extends React.Component<CommentTextInputProps, CommentTextInputState> {
    inputRef = React.createRef<TextInput>();

    constructor(props: CommentTextInputProps) {
        super(props);
        this.state = {focused: false, value: "", height: 0} as CommentTextInputState;
    }

    focus(): void {
        this.inputRef.current?.focus();
    }

    private send(): void {
        const {onSend} = this.props;
        const {value} = this.state;

        this.setState({...this.state, value: "", height: MIN_HEIGHT});
        this.inputRef.current?.blur();
        if (onSend) onSend(value);
    }

    render(): JSX.Element {
        const {style, theme} = this.props;
        const {value} = this.state;
        const styles = themedStyles(theme);

        const height = Math.max(MIN_HEIGHT, this.state.height);

        const icons =
            value.length < MIN_COMMENT_LENGTH ? (
                <></>
            ) : (
                <Button
                    style={styles.inputButton}
                    onPress={() => this.send()}
                    icon={<MaterialIcons name={"send"} style={styles.inputButtonIcon} />}
                />
            );

        return (
            <View style={[styles.wrapper, {height}, style, this.state.focused ? styles.focusedStyle : {}]}>
                <TextInput
                    ref={this.inputRef}
                    style={[
                        styles.input,
                        this.state.focused && Platform.OS === "web" && ({outline: "none"} as TextStyle),
                        this.state.focused && styles.inputFocusedStyle,
                    ]}
                    onBlur={() => this.setState({focused: false})}
                    onFocus={() => this.setState({focused: true})}
                    placeholder={i18n.t("groups.comments.placeholder")}
                    multiline
                    numberOfLines={4}
                    maxLength={MAX_COMMENT_LENGTH}
                    value={value}
                    placeholderTextColor={theme.textLight}
                    onChangeText={(value) => this.setState({...this.state, value})}
                    onContentSizeChange={(event) =>
                        this.setState({height: Math.min(MAX_HEIGHT, event.nativeEvent.contentSize.height)})
                    }
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
            backgroundColor: theme.onboardingInputBackground,
            borderRadius: 20,
        },
        focusedStyle: {
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.componentBorder,
        },
        inputFocusedStyle: {},
        input: {
            paddingLeft: 20,
            paddingTop: 10,
            paddingBottom: 10,
            alignItems: "center",
            flex: 1,
            height: "100%",
            backgroundColor: "transparent",
            color: theme.text,
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
