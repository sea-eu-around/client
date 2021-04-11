import {MaterialIcons} from "@expo/vector-icons";
import * as React from "react";
import {withTheme} from "react-native-elements";
import {Group, GroupPost} from "../model/groups";
import {ThemeProps} from "../types";
import ActionMenu, {ActionMenuClass, ActionMenuItem} from "./ActionMenu";
import i18n from "i18n-js";
import EditPostModal, {EditPostModalClass} from "./modals/EditPostModal";
import DeletePostConfirmModal, {DeletePostConfirmModalClass} from "./modals/DeletePostConfirmModal";
import QuickFormReport, {QuickFormReportClass} from "./forms/QuickFormReport";
import {ReportEntityType} from "../constants/reports";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import {GroupRole} from "../api/dto";

const reduxConnector = connect(
    (state: AppState) => ({
        localUser: state.profile.user,
    }),
    null,
    null,
    {forwardRef: true},
);

export type GroupPostMenuProps = ThemeProps & ConnectedProps<typeof reduxConnector>;

type GroupPostMenuState = {post: GroupPost | null; group: Group | null};

export class GroupPostMenuClass extends React.Component<GroupPostMenuProps, GroupPostMenuState> {
    private actionMenuRef = React.createRef<ActionMenuClass>();
    private editPostModalRef = React.createRef<EditPostModalClass>();
    private deletePostModalRef = React.createRef<DeletePostConfirmModalClass>();
    private reportFormRef = React.createRef<QuickFormReportClass>();

    constructor(props: GroupPostMenuProps) {
        super(props);
        this.state = {post: null, group: null};
    }

    show(group: Group, post: GroupPost): void {
        this.actionMenuRef.current?.show();
        this.setState({...this.state, group, post});
    }

    render(): JSX.Element {
        const {theme, localUser} = this.props;
        const {post, group} = this.state;

        const isLocalUser = post && post.creator.id === localUser?.id;
        const isAdmin = group && group.myRole == GroupRole.Admin;

        const editAction: ActionMenuItem = {
            icon: (style) => <MaterialIcons style={style} name="edit" />,
            text: i18n.t("groups.editPost.title"),
            onSelect: () => this.editPostModalRef.current?.show(),
        };
        const deleteAction: ActionMenuItem = {
            icon: (style) => <MaterialIcons style={style} name="delete" />,
            text: i18n.t("groups.deletePost.title"),
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

        if (isLocalUser) actions.push(editAction);
        if (isLocalUser || isAdmin) actions.push(deleteAction);
        if (!isLocalUser) actions.push(reportAction);
        actions.push({preset: "close"});

        return (
            <>
                <ActionMenu ref={this.actionMenuRef} title={i18n.t("groups.postMenu.title")} actions={actions} />
                {post && <EditPostModal ref={this.editPostModalRef} groupId={post.groupId} post={post} />}
                {post && <DeletePostConfirmModal ref={this.deletePostModalRef} groupId={post.groupId} post={post} />}
                {post && (
                    <QuickFormReport ref={this.reportFormRef} entity={post} entityType={ReportEntityType.POST_ENTITY} />
                )}
            </>
        );
    }
}

export default reduxConnector(withTheme(GroupPostMenuClass));
