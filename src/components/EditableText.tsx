import * as React from "react";
import {
    StyleProp,
    Text,
    View,
    ViewStyle,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";

// Component props
export type EditableTextProps = {
    nonEditable?: boolean;
    text: string;
    placeholder?: string;
    containerStyle?: StyleProp<ViewStyle>;
    fontSize?: number;
    onSubmit?: (value: string) => void;
} & ThemeProps;

// Component state
type EditableTextState = {editing: boolean; value: string};

class EditableText extends React.Component<EditableTextProps, EditableTextState> {
    constructor(props: EditableTextProps) {
        super(props);
        this.state = {editing: false, value: props.text};
    }

    private edit(): void {
        const {text} = this.props;
        this.setState({...this.state, editing: true, value: text});
    }

    private submit(): void {
        const {onSubmit} = this.props;
        this.setState({...this.state, editing: false});
        if (onSubmit) onSubmit(this.state.value);
    }

    componentDidUpdate(oldProps: EditableTextProps): void {
        const {text} = this.props;
        const {value} = this.state;
        if (oldProps.text !== text && text !== value) this.setState({...this.state, value: text});
    }

    render(): JSX.Element {
        const {nonEditable, containerStyle, text, placeholder, fontSize, theme} = this.props;
        const {editing, value} = this.state;
        const styles = themedStyles(theme);

        const submitting = !editing && value !== text;

        return (
            <View style={[styles.container, containerStyle]}>
                {!editing && (
                    <Text style={[styles.text, {fontSize}, text.length === 0 ? styles.textPlaceholder : {}]}>
                        {submitting ? value : text.length === 0 ? placeholder : text}
                    </Text>
                )}
                {editing && (
                    <TextInput
                        style={[styles.input, {fontSize}]}
                        value={value}
                        placeholder={placeholder}
                        autoFocus
                        onChangeText={(v: string) => this.setState({...this.state, value: v})}
                        onSubmitEditing={() => this.submit()}
                        onBlur={() => this.submit()}
                    />
                )}
                {submitting && (
                    <View style={styles.button}>
                        <ActivityIndicator size="small" color={theme.text} />
                    </View>
                )}
                {!submitting && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            if (!nonEditable) {
                                if (editing) this.submit();
                                else this.edit();
                            }
                        }}
                    >
                        {!nonEditable && <MaterialIcons style={styles.buttonIcon} name={editing ? "check" : "edit"} />}
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        container: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
        },
        text: {
            fontSize: 16,
            color: theme.text,
            flex: 1,
        },
        textPlaceholder: {
            color: theme.textLight,
        },
        input: {
            flex: 1,
            fontSize: 16,
        },
        button: {
            width: 32,
            height: 32,
            justifyContent: "center",
        },
        buttonIcon: {
            fontSize: 22,
            color: theme.textBlack,
        },
    });
});

export default withTheme(EditableText);
