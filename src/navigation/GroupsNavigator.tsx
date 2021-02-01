/* eslint-disable react/display-name */
import * as React from "react";
import {createStackNavigator, StackHeaderProps} from "@react-navigation/stack";
import {TabGroupsRoot} from "./types";
import {screenTitle} from "./utils";
import MainHeader from "../components/headers/MainHeader";
import TabGroupsScreen from "../screens/TabGroupsScreen";
import CreateGroupForm from "../components/forms/CreateGroupForm";
import CustomModal, {CustomModalClass} from "../components/modals/CustomModal";
import {TouchableOpacity} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {useRef} from "react";

const GroupsStack = createStackNavigator<TabGroupsRoot>();

export const GroupsNavigator = (): JSX.Element => {
    const ref = useRef<CustomModalClass>(null);

    return (
        <GroupsStack.Navigator>
            <GroupsStack.Screen
                name="TabGroupsScreen"
                options={() => ({
                    title: screenTitle("TabGroupsScreen"),
                    header: (props: StackHeaderProps) => (
                        <MainHeader
                            {...props}
                            rightButtons={[
                                (props) => (
                                    <TouchableOpacity style={props.buttonStyle} onPress={() => ref.current?.show()}>
                                        <MaterialIcons name="add" style={props.iconStyle} />
                                    </TouchableOpacity>
                                ),
                            ]}
                        />
                    ),
                })}
            >
                {(props) => (
                    <>
                        <TabGroupsScreen {...props} />
                        <CustomModal
                            ref={ref}
                            animationType="slide"
                            nonDismissable
                            fullWidth
                            fullHeight
                            modalViewStyle={{paddingVertical: 60, paddingHorizontal: 30}}
                            renderContent={(hide) => <CreateGroupForm onCancel={hide} onSuccessfulSubmit={hide} />}
                        />
                    </>
                )}
            </GroupsStack.Screen>
        </GroupsStack.Navigator>
    );
};
