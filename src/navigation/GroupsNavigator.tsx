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
                    options={(props) => {
                        const groupId = getRouteParams(props.route).groupId as string;
                        return {
                            title: screenTitle("GroupScreen"),
                            header: (headerProps) => <GroupScreenHeader groupId={groupId} {...headerProps} />,
                        };
                    }}
                    component={GroupScreen}
                />
            </GroupsStack.Navigator>
            <CreateGroupModal ref={createGroupModalRef} />
        </>
    );
};
