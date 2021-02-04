/* eslint-disable react/display-name */
import * as React from "react";
import {createStackNavigator, StackHeaderProps} from "@react-navigation/stack";
import {TabGroupsRoot} from "./types";
import {screenTitle} from "./utils";
import MainHeader from "../components/headers/MainHeader";
import TabGroupsScreen from "../screens/groups/TabGroupsScreen";
import CreateGroupForm from "../components/forms/CreateGroupForm";
import CustomModal, {CustomModalClass} from "../components/modals/CustomModal";
import {TouchableOpacity} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {useRef} from "react";
import CreateGroupModal from "../components/modals/CreateGroupModal";
import GroupsExploreScreen from "../screens/groups/GroupsExploreScreen";

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
            </GroupsStack.Navigator>
            <CreateGroupModal ref={createGroupModalRef} />
        </>
    );
};
