/* eslint-disable react/display-name */
import * as React from "react";
import {createStackNavigator, StackHeaderProps} from "@react-navigation/stack";
import {TabGroupsRoot} from "./types";
import {getRouteParams, screenTitle} from "./utils";
import MainHeader from "../components/headers/MainHeader";
import TabGroupsScreen from "../screens/groups/TabGroupsScreen";
import {CustomModalClass} from "../components/modals/CustomModal";
import {TouchableOpacity} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {useRef} from "react";
import CreateGroupModal from "../components/modals/CreateGroupModal";
import GroupsExploreScreen from "../screens/groups/GroupsExploreScreen";
import GroupScreen from "../screens/groups/GroupScreen";
import GroupScreenHeader from "../components/headers/GroupScreenHeader";
import GroupMembersScreen from "../screens/groups/GroupMembersScreen";
import GroupMembersScreenHeader from "../components/headers/GroupMembersScreenHeader";
import GroupInviteScreenHeader from "../components/headers/GroupInviteScreenHeader";
import GroupInviteScreen from "../screens/groups/GroupInviteScreen";
import GroupMembersApprovalScreen from "../screens/groups/GroupMembersApprovalScreen";
import GroupBannedMembersScreen from "../screens/groups/GroupBannedMembersScreen";

const GroupsStack = createStackNavigator<TabGroupsRoot>();

export const GroupsNavigator = (): JSX.Element => {
    const createGroupModalRef = useRef<CustomModalClass>(null);
    const header = (props: StackHeaderProps) => (
        <MainHeader
            {...props}
            rightButtons={[
                (props) => (
                    <TouchableOpacity style={props.buttonStyle} onPress={() => createGroupModalRef.current?.show()}>
                        <MaterialIcons name="add" style={props.iconStyle} />
                    </TouchableOpacity>
                ),
            ]}
        />
    );

    return (
        <>
            <GroupsStack.Navigator headerMode="screen">
                <GroupsStack.Screen
                    name="TabGroupsScreen"
                    options={() => ({
                        title: screenTitle("TabGroupsScreen"),
                        header,
                    })}
                    component={TabGroupsScreen}
                />
                <GroupsStack.Screen
                    name="GroupsExploreScreen"
                    options={() => ({
                        title: screenTitle("GroupsExploreScreen"),
                        header: (headerProps) => <MainHeader {...headerProps} noAvatar backButton />,
                    })}
                    component={GroupsExploreScreen}
                />
                <GroupsStack.Screen
                    name="GroupScreen"
                    options={() => ({
                        title: screenTitle("GroupScreen"),
                        headerShown: false,
                    })}
                >
                    {(props) => (
                        <>
                            <GroupScreen {...props} />
                            <GroupScreenHeader groupId={getRouteParams(props.route).groupId as string} {...props} />
                        </>
                    )}
                </GroupsStack.Screen>
                <GroupsStack.Screen
                    name="GroupMembersScreen"
                    options={(screenProps) => ({
                        title: screenTitle("GroupMembersScreen"),
                        header: (headerProps) => (
                            <GroupMembersScreenHeader
                                groupId={getRouteParams(screenProps.route).groupId as string}
                                {...headerProps}
                            />
                        ),
                    })}
                    component={GroupMembersScreen}
                />
                <GroupsStack.Screen
                    name="GroupBannedMembersScreen"
                    options={(screenProps) => ({
                        title: screenTitle("GroupBannedMembersScreen"),
                        header: (headerProps) => (
                            <GroupMembersScreenHeader
                                groupId={getRouteParams(screenProps.route).groupId as string}
                                keepScreenTitle
                                noInviteButton
                                {...headerProps}
                            />
                        ),
                    })}
                    component={GroupBannedMembersScreen}
                />
                <GroupsStack.Screen
                    name="GroupMembersApprovalScreen"
                    options={(screenProps) => ({
                        title: screenTitle("GroupMembersApprovalScreen"),
                        header: (headerProps) => (
                            <GroupMembersScreenHeader
                                groupId={getRouteParams(screenProps.route).groupId as string}
                                {...headerProps}
                            />
                        ),
                    })}
                    component={GroupMembersApprovalScreen}
                />
                <GroupsStack.Screen
                    name="GroupInviteScreen"
                    options={(screenProps) => ({
                        title: screenTitle("GroupInviteScreen"),
                        header: (headerProps) => (
                            <GroupInviteScreenHeader
                                groupId={getRouteParams(screenProps.route).groupId as string}
                                {...headerProps}
                            />
                        ),
                    })}
                    component={GroupInviteScreen}
                />
            </GroupsStack.Navigator>
            <CreateGroupModal ref={createGroupModalRef} />
        </>
    );
};
