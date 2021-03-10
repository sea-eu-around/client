import React from "react";
import CustomModal, {CustomModalClass, CustomModalProps} from "./CustomModal";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import EditPostForm from "../forms/EditPostForm";
import {GroupPost} from "../../model/groups";
import {preTheme} from "../../styles/utils";
import {MaterialIcons} from "@expo/vector-icons";
import i18n from "i18n-js";
import {SafeAreaInsetsContext} from "react-native-safe-area-context";

export type EditPostModalProps = ThemeProps & Partial<CustomModalProps> & {groupId: string; post?: GroupPost};

export class EditPostModalClass extends React.Component<EditPostModalProps> {
    modalRef = React.createRef<CustomModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {groupId, post, theme, ...otherProps} = this.props;

        const styles = themedStyles(theme);
        const createMode = post === undefined;

        return (
            <CustomModal
                ref={this.modalRef}
                animationType="slide"
                nonDismissable
                fullWidth
                fullHeight
                statusBarTranslucent
                modalViewStyle={{paddingVertical: 0, paddingHorizontal: 0}}
                renderContent={(hide) => (
                    <SafeAreaInsetsContext.Consumer>
                        {(insets) => (
                            <>
                                <View style={[styles.top, {paddingTop: insets?.top}]}>
                                    <TouchableOpacity style={styles.backButton} onPress={hide}>
                                        <MaterialIcons name="arrow-back" style={styles.backButtonIcon} />
                                    </TouchableOpacity>
                                    <Text style={styles.title}>
                                        {i18n.t(`groups.${createMode ? "newPost" : "editPost"}.title`)}
                                    </Text>
                                </View>
                                <EditPostForm
                                    containerStyle={[styles.form, {paddingBottom: insets?.bottom}]}
                                    groupId={groupId}
                                    post={post}
                                    onSuccessfulSubmit={hide}
                                />
                            </>
                        )}
                    </SafeAreaInsetsContext.Consumer>
                )}
                {...otherProps}
            />
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        top: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 5,
            marginBottom: 10,
            backgroundColor: theme.accent,
        },
        title: {
            fontSize: 18,
            color: theme.textWhite,
        },
        backButton: {
            padding: 10,
            marginRight: 5,
        },
        backButtonIcon: {
            fontSize: 24,
            color: theme.textWhite,
        },
        form: {
            width: "90%",
            flex: 1,
            marginTop: 10,
        },
    });
});

export default withTheme(EditPostModalClass);
