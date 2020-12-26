import React from "react";
import {TouchableOpacity, View, StyleSheet, Platform, Text} from "react-native";
import {BottomSheet, withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import CustomModal from "../modals/CustomModal";
import i18n from "i18n-js";
import FormSubmitButton from "../forms/FormSubmitButton";
import {Icon} from "expo";

export type QuickFormProps = ThemeProps & {
    activator: (open: () => void) => JSX.Element;
    submit: () => Promise<boolean>;
    hideSubmit?: boolean;
    title?: string;
    titleIcon?: {component: Icon<string, unknown>; name: string};
    confirmationTitle: string;
    confirmationText: string;
    failureTitle?: string;
    failureText?: string;
    submitText: string;
};

type QuickFormState = {
    open: boolean;
    confirmationOpen: boolean;
    failureOpen: boolean;
    submitting: boolean;
};

class QuickForm extends React.Component<QuickFormProps, QuickFormState> {
    constructor(props: QuickFormProps) {
        super(props);
        this.state = {open: false, confirmationOpen: false, failureOpen: false, submitting: false};
    }

    open(): void {
        this.setState({...this.state, open: true});
    }

    close(): void {
        this.setState({...this.state, open: false});
    }

    submit(): void {
        const {submit} = this.props;

        this.setState({...this.state, submitting: true});

        submit().then((success: boolean) => {
            if (success) {
                this.setState({
                    ...this.state,
                    submitting: false,
                    open: false,
                    confirmationOpen: true,
                    failureOpen: false,
                });
            } else {
                this.setState({
                    ...this.state,
                    submitting: false,
                    open: false,
                    confirmationOpen: false,
                    failureOpen: true,
                });
            }
        });
    }

    render(): JSX.Element {
        const {
            activator,
            hideSubmit,
            title,
            titleIcon,
            submitText,
            confirmationTitle,
            confirmationText,
            failureTitle,
            failureText,
            theme,
            children,
        } = this.props;
        const {open, confirmationOpen, failureOpen, submitting} = this.state;
        const styles = themedStyles(theme);

        const actionButtons = (
            <>
                {!hideSubmit && (
                    <FormSubmitButton
                        style={[styles.actionButton, styles.submitButton]}
                        textStyle={[styles.actionButtonText, styles.submitButtonText]}
                        text={submitText}
                        submitting={submitting}
                        onPress={() => this.submit()}
                    />
                )}
                <TouchableOpacity style={[styles.actionButton, styles.dismissButton]} onPress={() => this.close()}>
                    <Text style={[styles.actionButtonText, styles.dismissButtonText]}>{i18n.t("cancel")}</Text>
                </TouchableOpacity>
            </>
        );

        const content = (
            <>
                {(title || titleIcon) && (
                    <View style={styles.titleContainer}>
                        {titleIcon && (
                            <titleIcon.component name={titleIcon.name} style={[styles.title, styles.titleIcon]} />
                        )}
                        {title && <Text style={styles.title}>{title}</Text>}
                    </View>
                )}
                {children}
                {actionButtons}
            </>
        );

        return (
            <>
                {activator(() => this.open())}
                {Platform.OS === "web" ? (
                    <CustomModal
                        visible={open}
                        onHide={() => this.close()}
                        renderContent={() => <View style={styles.containerModal}>{content}</View>}
                    />
                ) : (
                    <BottomSheet modalProps={{statusBarTranslucent: true}} isVisible={open}>
                        <View style={styles.wrapperSheet}>
                            <View style={styles.containerSheet}>{content}</View>
                        </View>
                    </BottomSheet>
                )}
                <CustomModal
                    visible={confirmationOpen}
                    onHide={() => this.setState({...this.state, confirmationOpen: false})}
                    modalViewStyle={styles.feedbackModal}
                    renderContent={() => (
                        <View style={styles.containerModal}>
                            <Text style={styles.feedbackTitle}>{confirmationTitle}</Text>
                            <Text style={styles.feedbackText}>{confirmationText}</Text>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.dismissButton]}
                                onPress={() => this.setState({...this.state, confirmationOpen: false})}
                            >
                                <Text style={[styles.actionButtonText, styles.dismissButtonText]}>{i18n.t("ok")}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <CustomModal
                    visible={failureOpen}
                    onHide={() => this.setState({...this.state, failureOpen: false})}
                    modalViewStyle={styles.feedbackModal}
                    renderContent={() => (
                        <View style={styles.containerModal}>
                            <Text style={styles.feedbackTitle}>{failureTitle}</Text>
                            <Text style={styles.feedbackText}>{failureText}</Text>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.dismissButton]}
                                onPress={() => this.setState({...this.state, failureOpen: false})}
                            >
                                <Text style={[styles.actionButtonText, styles.dismissButtonText]}>{i18n.t("ok")}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapperSheet: {
            width: "100%",
            paddingVertical: 20,
            alignItems: "center",
            backgroundColor: theme.cardBackground,
        },
        containerSheet: {
            width: "90%",
        },
        containerModal: {
            width: "100%",
        },

        // Title
        titleContainer: {
            flexDirection: "row",
            marginBottom: 20,
            alignItems: "center",
            justifyContent: "center",
        },
        titleIcon: {
            marginRight: 5,
        },
        title: {
            fontSize: 22,
            color: theme.text,
        },

        // Actions
        actionButton: {
            width: "100%",
            borderRadius: 20,
            height: 44,
            marginTop: 15,
            justifyContent: "center",
            alignItems: "center",
        },
        submitButton: {
            backgroundColor: theme.accent,
        },
        dismissButton: {
            backgroundColor: theme.cardBackground,
            borderColor: theme.accent,
            borderWidth: 1,
        },
        actionButtonText: {
            fontSize: 16,
        },
        submitButtonText: {color: theme.textWhite},
        dismissButtonText: {color: theme.accent},

        feedbackModal: {
            paddingVertical: 15,
            paddingHorizontal: 20,
        },
        feedbackTitle: {
            fontSize: 20,
            color: theme.text,
            marginBottom: 15,
        },
        feedbackText: {
            fontSize: 15,
            textAlign: "justify",
            color: theme.text,
        },
    });
});

export default withTheme(QuickForm);
