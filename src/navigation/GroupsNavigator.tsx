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
            <GroupsStack.Navigator>
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
                        header,
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
                    options={(props) => ({
                        title: screenTitle("GroupMembersScreen"),
                        header: (headerProps) => (
                            <GroupMembersScreenHeader
                                groupId={getRouteParams(props.route).groupId as string}
                                {...headerProps}
                            />
                        ),
                    })}
                    component={GroupMembersScreen}
                />
                <GroupsStack.Screen
                    name="GroupInviteScreen"
                    options={(props) => ({
                        title: screenTitle("GroupInviteScreen"),
                        header: (headerProps) => (
                            <GroupInviteScreenHeader
                                groupId={getRouteParams(props.route).groupId as string}
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
