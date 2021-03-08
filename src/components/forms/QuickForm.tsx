import React from "react";
import {View, StyleSheet, Text, Platform} from "react-native";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import CustomModal from "../modals/CustomModal";
import i18n from "i18n-js";
import FormSubmitButton from "../forms/FormSubmitButton";
import {Icon} from "expo";
import Button from "../Button";
import BottomSheet, {BottomSheetClass} from "../bottom-sheet/BottomSheet";
import BottomSheetTouchableOpacity from "../bottom-sheet/BottomSheetTouchableOpacity";

export type QuickFormProps = ThemeProps & {
    activator?: (open: () => void) => JSX.Element;
    submit: () => Promise<boolean>;
    hideSubmit?: boolean;
    title?: string;
    titleIcon?: {component: Icon<string, unknown>; name: string};
    confirmationTitle: string;
    confirmationText: string;
    failureTitle?: string;
    failureText?: string;
    submitText: string;
    sheetHeight?: number;
};

type QuickFormState = {
    confirmationOpen: boolean;
    failureOpen: boolean;
    submitting: boolean;
};

export class QuickFormClass extends React.Component<QuickFormProps, QuickFormState> {
    sheetRef = React.createRef<BottomSheetClass>();

    constructor(props: QuickFormProps) {
        super(props);
        this.state = {confirmationOpen: false, failureOpen: false, submitting: false};
    }

    open(): void {
        this.sheetRef.current?.show();
    }

    close(): void {
        this.sheetRef.current?.hide();
    }

    submit(): void {
        const {submit} = this.props;

        this.setState({...this.state, submitting: true});

        submit().then((success: boolean) => {
            if (success) {
                this.setState({
                    ...this.state,
                    submitting: false,
                    confirmationOpen: true,
                    failureOpen: false,
                });
            } else {
                this.setState({
                    ...this.state,
                    submitting: false,
                    confirmationOpen: false,
                    failureOpen: true,
                });
            }
            this.close();
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
            sheetHeight,
            children,
        } = this.props;
        const {confirmationOpen, failureOpen, submitting} = this.state;
        const styles = themedStyles(theme);

        return (
            <>
                {activator && activator(() => this.open())}
                <BottomSheet
                    ref={this.sheetRef}
                    snapPoints={[0, sheetHeight === undefined ? 300 : sheetHeight]}
                    renderContent={(hide) => (
                        <View style={styles.wrapperSheet}>
                            <View style={styles.containerSheet}>
                                {(title || titleIcon) && (
                                    <View style={styles.titleContainer}>
                                        {titleIcon && (
                                            <titleIcon.component
                                                name={titleIcon.name}
                                                style={[styles.title, styles.titleIcon]}
                                            />
                                        )}
                                        {title && <Text style={styles.title}>{title}</Text>}
                                    </View>
                                )}
                                {children}
                                {!hideSubmit && (
                                    <FormSubmitButton
                                        text={submitText}
                                        submitting={submitting}
                                        onPress={() => this.submit()}
                                        skin="rounded-filled"
                                        style={styles.actionButton}
                                        textStyle={styles.actionButtonText}
                                        TouchableComponent={BottomSheetTouchableOpacity}
                                    />
                                )}
                                <Button
                                    text={i18n.t("cancel")}
                                    onPress={hide}
                                    skin="rounded-hollow"
                                    style={styles.actionButton}
                                    textStyle={styles.actionButtonText}
                                    TouchableComponent={BottomSheetTouchableOpacity}
                                />
                            </View>
                        </View>
                    )}
                />
                <CustomModal
                    visible={confirmationOpen}
                    onHide={() => this.setState({...this.state, confirmationOpen: false})}
                    modalViewStyle={styles.feedbackModal}
                    renderContent={() => (
                        <View style={styles.containerModal}>
                            <Text style={styles.feedbackTitle}>{confirmationTitle}</Text>
                            <Text style={styles.feedbackText}>{confirmationText}</Text>
                            <Button
                                text={i18n.t("ok")}
                                onPress={() => this.setState({...this.state, confirmationOpen: false})}
                                skin="rounded-hollow"
                                style={styles.actionButton}
                                textStyle={styles.actionButtonText}
                            />
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
                            <Button
                                text={i18n.t("ok")}
                                onPress={() => this.setState({...this.state, failureOpen: false})}
                                skin="rounded-hollow"
                                style={styles.actionButton}
                                textStyle={styles.actionButtonText}
                            />
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
            alignItems: "center",
            padding: Platform.OS === "web" ? 20 : 0,
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
            height: 44,
            marginVertical: 0,
            marginTop: 15,
        },
        actionButtonText: {
            fontSize: 16,
        },

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

export default withTheme(QuickFormClass);
