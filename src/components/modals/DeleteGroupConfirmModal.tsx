import React from "react";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal, {ConfirmationModalClass} from "./ConfirmationModal";
import {MaterialIcons} from "@expo/vector-icons";
import i18n from "i18n-js";
import store from "../../state/store";
import {leaveGroup} from "../../state/groups/actions";
import {MyThunkDispatch} from "../../state/types";
import {StyleSheet} from "react-native";
import {preTheme} from "../../styles/utils";
import {Group} from "../../model/groups";
import ValidatedTextInput from "../ValidatedTextInput";

export type DeleteGroupConfirmModalProps = ThemeProps & Partial<CustomModalProps> & {group: Group};

type DeleteGroupConfirmModalState = {inputValue: string; inputCorrect: boolean};

export class DeleteGroupConfirmModalClass extends React.Component<
    DeleteGroupConfirmModalProps,
    DeleteGroupConfirmModalState
> {
    private modalRef = React.createRef<ConfirmationModalClass>();

    constructor(props: DeleteGroupConfirmModalProps) {
        super(props);
        this.state = {inputValue: "", inputCorrect: false};
    }

    show(): void {
        this.modalRef.current?.show();
        this.setInput("");
    }

    private setInput(value: string) {
        const {group} = this.props;
        const inputCorrect = value === group.name;
        this.setState({...this.state, inputValue: value, inputCorrect});
    }

    render(): JSX.Element {
        const {group, theme, ...otherProps} = this.props;
        const {inputValue, inputCorrect} = this.state;

        const styles = themedStyles(theme);
        const dispatch = store.dispatch as MyThunkDispatch;

        return (
            <ConfirmationModal
                ref={this.modalRef}
                title={i18n.t("groups.delete.title")}
                text={i18n.t("groups.delete.text")}
                icon={(props) => <MaterialIcons name="delete-forever" color={theme.error} {...props} />}
                buttons={[
                    {preset: "cancel"},
                    {
                        text: i18n.t("ok"),
                        preset: "delete",
                        disabled: !inputCorrect,
                        onPress: (hide) => {
                            dispatch(leaveGroup(group.id));
                            hide();
                        },
                    },
                ]}
                additionalContent={() => (
                    <ValidatedTextInput
                        value={inputValue}
                        onChangeText={(value) => this.setInput(value)}
                        placeholder={group.name}
                        style={styles.input}
                        errorStyle={styles.inputIncorrect}
                        placeholderTextColor={theme.inputPlaceholder}
                        error={inputCorrect ? undefined : "error"}
                        showErrorText={false}
                    />
                )}
                {...otherProps}
            />
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        input: {
            width: "100%",
            height: 42,
            borderRadius: 10,
            backgroundColor: theme.onboardingInputBackground,
            fontSize: 16,
            paddingHorizontal: 15,
            borderBottomWidth: 2,
            borderBottomColor: theme.okay,
        },
        inputIncorrect: {
            borderBottomColor: theme.error,
        },
    });
});

export default withTheme(DeleteGroupConfirmModalClass);
