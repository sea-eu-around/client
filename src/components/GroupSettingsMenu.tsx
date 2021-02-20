import {MaterialIcons} from "@expo/vector-icons";
import * as React from "react";
import {withTheme} from "react-native-elements";
import {Group} from "../model/groups";
import {ThemeProps} from "../types";
import ActionMenu, {ActionMenuClass, ActionMenuItem} from "./ActionMenu";
import i18n from "i18n-js";
import {DeletePostConfirmModalClass} from "./modals/DeletePostConfirmModal";
import {QuickFormReportClass} from "./forms/QuickFormReport";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {GroupRole} from "../api/dto";
import LeaveGroupConfirmModal, {LeaveGroupConfirmModalClass} from "./modals/LeaveGroupConfirmModal";

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
    private deletePostModalRef = React.createRef<DeletePostConfirmModalClass>();
    private reportFormRef = React.createRef<QuickFormReportClass>();

    constructor(props: GroupSettingsMenuProps) {
        super(props);
        this.state = {group: null, actions: []};
    }

    show(group: Group): void {
        this.actionMenuRef.current?.show();
        console.log("show");
        this.setState({...this.state, group});
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const {group} = this.state;

        const isAdmin = group && group.myRole == GroupRole.Admin;

        const leaveAction: ActionMenuItem = {
            icon: (style) => <MaterialIcons style={style} name="edit" />,
            text: i18n.t("groups.settings.leave.title"),
            onSelect: () => this.leaveModalRef.current?.show(),
        };
        const manageBansAction: ActionMenuItem = {
            icon: (style) => <MaterialIcons style={style} name="edit" />,
            text: i18n.t("groups.settings.manageBans.title"),
            onSelect: () => this.leaveModalRef.current?.show(),
        };
        const manageMembersAction: ActionMenuItem = {
            icon: (style) => <MaterialIcons style={style} name="edit" />,
            text: i18n.t("groups.settings.manageMembers.title"),
            onSelect: () => this.leaveModalRef.current?.show(),
        };
        const deleteAction: ActionMenuItem = {
            icon: (style) => <MaterialIcons style={style} name="delete" />,
            text: i18n.t("groups.settings.delete.title"),
            containerStyle: {backgroundColor: theme.error},
            textStyle: {color: "white"},
            onSelect: () => this.deletePostModalRef.current?.show(),
        };
        const reportAction: ActionMenuItem = {
            icon: (style) => <MaterialIcons style={style} name="report" />,
            text: i18n.t("groups.reportPost"),
            containerStyle: {backgroundColor: theme.error},
            textStyle: {color: "white"},
            onSelect: () => this.reportFormRef.current?.open(),
        };

        const actions: ActionMenuItem[] = [];

        if (isAdmin) actions.push(manageBansAction);
        if (isAdmin) actions.push(manageMembersAction);
        if (isAdmin) actions.push(deleteAction);
        if (isAdmin) actions.push(manageBansAction);
        actions.push(leaveAction);
        actions.push(reportAction);
        actions.push({preset: "close"});

        return (
            <>
                <ActionMenu ref={this.actionMenuRef} title={i18n.t("groups.postMenu.title")} actions={actions} />
                {group && <LeaveGroupConfirmModal ref={this.leaveModalRef} groupId={group.id} />}
                {/*post && <EditPostModal ref={this.editPostModalRef} groupId={post.groupId} post={post} />}
                {post && <DeletePostConfirmModal ref={this.deletePostModalRef} groupId={post.groupId} post={post} />}
                {post && (
                    <QuickFormReport ref={this.reportFormRef} entity={post} entityType={ReportEntityType.POST_ENTITY} />
                )*/}
            </>
        );
    }
}

export default reduxConnector(withTheme(GroupSettingsMenuClass));
