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
                statusBarTranslucent={false}
                modalViewStyle={{paddingVertical: 0, paddingHorizontal: 0}}
                renderContent={(hide) => (
                    <>
                        <View style={styles.top}>
                            <TouchableOpacity style={styles.backButton} onPress={hide}>
                                <MaterialIcons name="arrow-back" style={styles.backButtonIcon} />
                            </TouchableOpacity>
                            <Text style={styles.title}>
                                {i18n.t(`groups.${createMode ? "newPost" : "editPost"}.title`)}
                            </Text>
                        </View>
                        <EditPostForm
                            containerStyle={styles.form}
                            groupId={groupId}
                            post={post}
                            onCancel={hide}
                            onSuccessfulSubmit={hide}
                        />
                    </>
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
        },
        title: {
            fontSize: 18,
            color: theme.text,
        },
        backButton: {
            padding: 10,
            marginRight: 5,
        },
        backButtonIcon: {
            fontSize: 24,
            color: theme.text,
        },
        form: {
            width: "90%",
            flex: 1,
        },
    });
});

export default withTheme(EditPostModalClass);
