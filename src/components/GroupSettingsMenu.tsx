import {MaterialIcons} from "@expo/vector-icons";
import * as React from "react";
import {withTheme} from "react-native-elements";
import {Group} from "../model/groups";
import {ThemeProps} from "../types";
import ActionMenu, {ActionMenuClass, ActionMenuItem} from "./ActionMenu";
import i18n from "i18n-js";
import QuickFormReport, {QuickFormReportClass} from "./forms/QuickFormReport";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {GroupRole} from "../api/dto";
import LeaveGroupConfirmModal, {LeaveGroupConfirmModalClass} from "./modals/LeaveGroupConfirmModal";
import DeleteGroupConfirmModal, {DeleteGroupConfirmModalClass} from "./modals/DeleteGroupConfirmModal";
import {rootNavigate} from "../navigation/utils";
import {ReportEntityType} from "../constants/reports";
import GroupSettingsModal, {GroupSettingsModalClass} from "./modals/GroupSettingsModal";

const reduxConnector = connect(
    (state: AppState) => ({
        localUser: state.profile.user,
    }),
    null,
    null,
    {forwardRef: true},
);

export type GroupSettingsMenuProps = ThemeProps & ConnectedProps<typeof reduxConnector>;

type GroupSettingsMenuState = {group: Group | null; actions: ActionMenuItem[]};

export class GroupSettingsMenuClass extends React.Component<GroupSettingsMenuProps, GroupSettingsMenuState> {
    private actionMenuRef = React.createRef<ActionMenuClass>();
    private leaveModalRef = React.createRef<LeaveGroupConfirmModalClass>();
    private deleteGroupModalRef = React.createRef<DeleteGroupConfirmModalClass>();
    private reportFormRef = React.createRef<QuickFormReportClass>();
    private settingsModalRef = React.createRef<GroupSettingsModalClass>();

    constructor(props: GroupSettingsMenuProps) {
        super(props);
        this.state = {group: null, actions: []};
    }

    show(group: Group): void {
        this.actionMenuRef.current?.show();
        this.setState({...this.state, group});
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const {group} = this.state;

        const isAdmin = group && group.myRole == GroupRole.Admin;

        const leaveAction: ActionMenuItem = {
            icon: (style) => <MaterialIcons style={style} name="exit-to-app" />,
            text: i18n.t("groups.leave.title"),
            onSelect: () => this.leaveModalRef.current?.show(),
        };
        const manageBansAction: ActionMenuItem = {
            icon: (style) => <MaterialIcons style={style} name="block" />,
            text: i18n.t("groups.members.manageBanned"),
            onSelect: () =>
                group &&
                rootNavigate("TabGroups", {
                    screen: "GroupBannedMembersScreen",
                    params: {groupId: group.id},
                }),
        };
        const manageMembersAction: ActionMenuItem = {
            icon: (style) => <MaterialIcons style={style} name="group" />,
            text: i18n.t("groups.members.manage"),
            onSelect: () =>
                group &&
                rootNavigate("TabGroups", {
                    screen: "GroupMembersScreen",
                    params: {groupId: group.id},
                }),
        };
        const settingsAction: ActionMenuItem = {
            icon: (style) => <MaterialIcons style={style} name="settings" />,
            text: i18n.t("groups.settings.title"),
            onSelect: () => this.settingsModalRef.current?.show(),
        };
        const deleteAction: ActionMenuItem = {
            icon: (style) => <MaterialIcons style={style} name="delete" />,
            text: i18n.t("groups.delete.title"),
            containerStyle: {backgroundColor: theme.error},
            textStyle: {color: "white"},
            onSelect: () => this.deleteGroupModalRef.current?.show(),
        };
        const reportAction: ActionMenuItem = {
            icon: (style) => <MaterialIcons style={style} name="report" />,
            text: i18n.t("groups.reportPost"),
            containerStyle: {backgroundColor: theme.error},
            textStyle: {color: "white"},
            onSelect: () => this.reportFormRef.current?.open(),
        };

        const actions: ActionMenuItem[] = [];

        if (isAdmin) actions.push(manageMembersAction);
        if (isAdmin) actions.push(manageBansAction);
        actions.push(settingsAction);
        actions.push(leaveAction);
        if (isAdmin) actions.push(deleteAction);
        actions.push(reportAction);
        actions.push({preset: "close"});

        return (
            <>
                <ActionMenu ref={this.actionMenuRef} title={i18n.t("groups.group")} actions={actions} />
                {group && (
                    <>
                        <LeaveGroupConfirmModal ref={this.leaveModalRef} groupId={group.id} />
                        <DeleteGroupConfirmModal ref={this.deleteGroupModalRef} group={group} />
                        <GroupSettingsModal ref={this.settingsModalRef} group={group} />
                        <QuickFormReport
                            ref={this.reportFormRef}
                            entity={group}
                            entityType={ReportEntityType.GROUP_ENTITY}
                        />
                    </>
                )}
            </>
        );
    }
}

export default reduxConnector(withTheme(GroupSettingsMenuClass));
