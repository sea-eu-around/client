import React from "react";
import {View, StyleSheet, Text} from "react-native";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {Theme, ThemeProps} from "../../types";
import i18n from "i18n-js";
import {MaterialIcons} from "@expo/vector-icons";
import PopUpSelector from "../PopUpSelector";
import {ReportEntityType, ReportType, REPORT_TYPES} from "../../constants/reports";
import InputLabel from "../InputLabel";
import {ChatRoomUser} from "../../model/chat-room";
import {UserProfile} from "../../model/user-profile";
import store from "../../state/store";
import {reportEntity} from "../../state/reports/actions";
import {MyThunkDispatch} from "../../state/types";
import QuickForm, {QuickFormClass} from "./QuickForm";
import {GroupPost, PostComment} from "../../model/groups";
import BottomSheetTouchableOpacity from "../bottom-sheet/BottomSheetTouchableOpacity";

export type QuickFormReportProps = ThemeProps & {
    entityType: ReportEntityType;
    entity: unknown;
    activator?: (open: () => void) => JSX.Element;
    onSubmit?: (success: boolean) => void;
};

type QuickFormReportState = {
    selectedType: ReportType | null;
};

// TODO try on web (maybe usable when not wide)

export class QuickFormReportClass extends React.Component<QuickFormReportProps, QuickFormReportState> {
    quickFormRef = React.createRef<QuickFormClass>();

    constructor(props: QuickFormReportProps) {
        super(props);
        this.state = {selectedType: null};
    }

    private getEntityInfo(): {id: string; name: string} | null {
        const {entityType, entity} = this.props;

        if (!entity) return null;

        switch (entityType) {
            case ReportEntityType.PROFILE_ENTITY: {
                if ((entity as ChatRoomUser)._id) {
                    const u = entity as ChatRoomUser;
                    return {name: u.name, id: u._id};
                } else {
                    const p = entity as UserProfile;
                    return {name: `${p.firstName} ${p.lastName}`, id: p.id};
                }
            }
            case ReportEntityType.POST_ENTITY: {
                const post = entity as GroupPost;
                const {firstName, lastName} = post.creator;
                return {name: i18n.t("report.postFrom", {name: `${firstName} ${lastName}`}), id: post.id};
            }
            case ReportEntityType.COMMENT_ENTITY: {
                const comment = entity as PostComment;
                const {firstName, lastName} = comment.creator;
                return {name: i18n.t("report.commentFrom", {name: `${firstName} ${lastName}`}), id: comment.id};
            }
            default:
                return null;
        }
    }

    open(): void {
        this.quickFormRef.current?.open();
    }

    close(): void {
        this.quickFormRef.current?.close();
    }

    async submit(): Promise<boolean> {
        const {entityType, onSubmit} = this.props;
        const {selectedType} = this.state;

        const info = this.getEntityInfo();

        let success = false;
        if (selectedType && info)
            success = await (store.dispatch as MyThunkDispatch)(reportEntity(selectedType, entityType, info.id));

        if (onSubmit) onSubmit(success);
        return success;
    }

    render(): JSX.Element {
        const {activator, theme} = this.props;
        const {selectedType} = this.state;
        const styles = themedStyles(theme);

        const info = this.getEntityInfo();

        return (
            <>
                <QuickForm
                    activator={activator}
                    ref={this.quickFormRef}
                    submit={() => this.submit()}
                    titleIcon={{component: MaterialIcons, name: "report"}}
                    title={i18n.t("report.title")}
                    submitText={i18n.t("report.send")}
                    confirmationTitle={i18n.t("report.confirmationTitle")}
                    confirmationText={i18n.t("report.confirmation")}
                    failureTitle={i18n.t("report.failureTitle")}
                    failureText={i18n.t("report.failure")}
                    hideSubmit={!selectedType}
                    sheetHeight={330}
                >
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
                            buttonStyleVariant="onboarding"
                            TouchableComponent={BottomSheetTouchableOpacity}
                        />
                    </View>
                </QuickForm>
            </>
        );
    }
}

export const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
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
    });
});

export default withTheme(QuickFormReportClass);
