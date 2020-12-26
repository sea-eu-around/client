import React from "react";
import {TouchableOpacity, View, StyleSheet, Platform, Text} from "react-native";
import {BottomSheet, withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import CustomModal from "./modals/CustomModal";
import i18n from "i18n-js";
import {MaterialIcons} from "@expo/vector-icons";
import PopUpSelector from "./PopUpSelector";
import {ReportEntityType, ReportType, REPORT_TYPES} from "../constants/reports";
import InputLabel from "./InputLabel";
import {ChatRoomUser} from "../model/chat-room";
import {UserProfile} from "../model/user-profile";
import FormSubmitButton from "./forms/FormSubmitButton";
import store from "../state/store";
import {reportEntity} from "../state/reports/actions";
import {MyThunkDispatch} from "../state/types";

export type EntityReportProps = ThemeProps & {
    entityType: ReportEntityType;
    entity: unknown;
    activator: (open: () => void) => JSX.Element;
};

type EntityReportState = {
    open: boolean;
    confirmationOpen: boolean;
    selectedType: ReportType | null;
    submitting: boolean;
};

class EntityReport extends React.Component<EntityReportProps, EntityReportState> {
    constructor(props: EntityReportProps) {
        super(props);
        this.state = {open: false, confirmationOpen: false, selectedType: null, submitting: false};
    }

    open(): void {
        this.setState({...this.state, open: true});
    }

    close(): void {
        this.setState({...this.state, open: false});
    }

    openConfirmation(): void {
        this.setState({...this.state, confirmationOpen: true});
    }

    closeConfirmation(): void {
        this.setState({...this.state, confirmationOpen: false});
    }

    private getEntityInfo(): {id: string; name: string} | null {
        const {entityType, entity} = this.props;

        switch (entityType) {
            case ReportEntityType.PROFILE_ENTITY:
                if ((entity as ChatRoomUser)._id) {
                    const u = entity as ChatRoomUser;
                    return {name: u.name, id: u._id};
                } else {
                    const p = entity as UserProfile;
                    return {name: `${p.firstName} ${p.lastName}`, id: p.id};
                }
                break;
            default:
                return null;
        }
    }

    submit(): void {
        const {entityType} = this.props;
        const {selectedType} = this.state;

        const info = this.getEntityInfo();

        if (selectedType && info) {
            this.setState({...this.state, submitting: true});
            (store.dispatch as MyThunkDispatch)(reportEntity(selectedType, entityType, info.id)).then(
                (success: boolean) => {
                    if (success) this.setState({...this.state, submitting: false, open: false, confirmationOpen: true});
                    else this.setState({...this.state, submitting: false});
                },
            );
        }
    }

    render(): JSX.Element {
        const {activator, theme} = this.props;
        const {open, confirmationOpen, selectedType, submitting} = this.state;
        const styles = themedStyles(theme);

        const info = this.getEntityInfo();

        const content = (
            <>
                <View style={styles.titleContainer}>
                    <MaterialIcons name="report" style={[styles.title, styles.titleIcon]} />
                    <Text style={styles.title}>{i18n.t("report.title")}</Text>
                </View>

                <View style={styles.inputItem}>
                    <InputLabel>{i18n.t("report.what")}</InputLabel>
                    <Text style={styles.what}>{info ? info.name : "unknown"}</Text>
                </View>

                <View style={styles.inputItem}>
                    <InputLabel>{i18n.t("report.why")}</InputLabel>
                    <PopUpSelector
                        values={REPORT_TYPES}
                        label={(t: string) => i18n.t(`report.types.${t}`)}
                        placeholder={i18n.t("report.typePlaceholder")}
                        selected={selectedType ? [selectedType] : []}
                        valueStyle={styles.selectorValue}
                        //buttonStyle={[styles.button, buttonStyle]}
                        onSelect={(values: string[]) => {
                            if (values.length > 0)
                                this.setState({...this.state, selectedType: values[0] as ReportType});
                        }}
                    />
                </View>

                {selectedType && (
                    <FormSubmitButton
                        style={[styles.actionButton, styles.sendButton]}
                        textStyle={[styles.actionButtonText, styles.sendButtonText]}
                        text={i18n.t("report.send")}
                        submitting={submitting}
                        onPress={() => this.submit()}
                    />
                )}
                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => this.close()}>
                    <Text style={[styles.actionButtonText, styles.cancelButtonText]}>{i18n.t("report.cancel")}</Text>
                </TouchableOpacity>
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
                    onHide={() => this.closeConfirmation()}
                    modalViewStyle={styles.confirmationModal}
                    renderContent={() => (
                        <View style={styles.containerModal}>
                            <Text style={styles.confirmationTitle}>{i18n.t("report.confirmationTitle")}</Text>
                            <Text style={styles.confirmationText}>{i18n.t("report.confirmation")}</Text>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={() => this.closeConfirmation()}
                            >
                                <Text style={[styles.actionButtonText, styles.cancelButtonText]}>{i18n.t("ok")}</Text>
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

        // Inputs
        inputItem: {
            marginBottom: 20,
        },
        what: {
            fontSize: 16,
            color: theme.text,
            textAlign: "right",
        },
        selectorValue: {
            fontSize: 16,
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
        sendButton: {
            backgroundColor: theme.accent,
        },
        cancelButton: {
            backgroundColor: theme.cardBackground,
            borderColor: theme.accent,
            borderWidth: 1,
        },
        actionButtonText: {
            fontSize: 16,
        },
        sendButtonText: {color: theme.textWhite},
        cancelButtonText: {color: theme.accent},

        confirmationModal: {
            paddingVertical: 15,
            paddingHorizontal: 20,
        },
        confirmationTitle: {
            fontSize: 20,
            color: theme.text,
        },
        confirmationText: {
            fontSize: 15,
            textAlign: "justify",
            color: theme.text,
        },
    });
});

export default withTheme(EntityReport);
