import React from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../../types";
import {CheckBox, withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {UserProfile} from "../../model/user-profile";
import {MyThunkDispatch} from "../../state/types";
import {blockProfile, cancelMatchAction} from "../../state/matching/actions";
import store from "../../state/store";
import CustomModal, {CustomModalProps} from "./CustomModal";
import Button from "../Button";

export type UnmatchProfileModalProps = ThemeProps &
    Partial<CustomModalProps> & {
        onSubmit?: (block: boolean) => void;
        profile: UserProfile | null;
        roomId: string | null;
    };

type UnmatchProfileModalState = {block: boolean};

class UnmatchProfileModal extends React.Component<UnmatchProfileModalProps, UnmatchProfileModalState> {
    constructor(props: UnmatchProfileModalProps) {
        super(props);
        this.state = {block: false};
    }

    render() {
        const {theme, profile, roomId, onSubmit, ...otherProps} = this.props;
        const {block} = this.state;
        const styles = themedStyles(theme);

        return (
            <CustomModal
                {...otherProps}
                renderContent={(hide: () => void) =>
                    profile ? (
                        <>
                            <Text style={styles.text}>
                                {i18n.t("unmatch.text", {firstname: profile.firstName, lastname: profile.lastName})}
                            </Text>
                            <Text style={styles.text}>
                                {i18n.t("unmatch.blockQuestion", {
                                    firstname: profile.firstName,
                                    lastname: profile.lastName,
                                })}
                            </Text>
                            <TouchableOpacity
                                style={styles.blockTouchable}
                                onPress={() => this.setState({...this.state, block: !block})}
                            >
                                <CheckBox
                                    containerStyle={styles.checkboxContainer}
                                    checked={block}
                                    onPress={() => this.setState({...this.state, block: !block})}
                                />
                                <Text style={styles.text}>{i18n.t("block.action")}</Text>
                            </TouchableOpacity>
                            <View style={styles.actionButtonsWrapper}>
                                <Button
                                    text={i18n.t("cancel")}
                                    onPress={() => hide()}
                                    skin="rounded-hollow"
                                    style={styles.actionButton}
                                    textStyle={styles.actionText}
                                />
                                <Button
                                    text={i18n.t("unmatch.action")}
                                    onPress={() => {
                                        hide();
                                        if (roomId) (store.dispatch as MyThunkDispatch)(cancelMatchAction(roomId));
                                        if (block) (store.dispatch as MyThunkDispatch)(blockProfile(profile.id));
                                        if (onSubmit) onSubmit(block);
                                    }}
                                    skin="rounded-filled"
                                    style={[styles.actionButton, styles.redBackground]}
                                    textStyle={styles.actionText}
                                />
                            </View>
                        </>
                    ) : (
                        <></>
                    )
                }
            />
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        text: {
            fontSize: 16,
            textAlign: "justify",
            color: theme.text,
        },
        blockTouchable: {
            width: "100%",
            marginTop: 5,
            flexDirection: "row",
            alignItems: "center",
        },
        checkboxContainer: {
            padding: 0,
            marginLeft: 0,
            marginRight: 5,
        },

        actionButtonsWrapper: {
            width: "100%",
            flexDirection: "row",
            marginTop: 20,
        },
        actionButton: {
            flex: 1,
            marginHorizontal: 7,
            marginVertical: 0,
        },
        actionText: {
            fontSize: 16,
        },
        redBackground: {
            backgroundColor: theme.error,
        },
    });
});

export default withTheme(UnmatchProfileModal);
