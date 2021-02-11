import React from "react";
import {Text, StyleSheet, TouchableOpacity} from "react-native";
import i18n from "i18n-js";
import {ThemeProps} from "../../types";
import {CheckBox, withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {UserProfile} from "../../model/user-profile";
import {MyThunkDispatch} from "../../state/types";
import {blockProfile, cancelMatchAction} from "../../state/matching/actions";
import store from "../../state/store";
import {CustomModalProps} from "./CustomModal";
import ConfirmationModal from "./ConfirmationModal";
import {MaterialIcons} from "@expo/vector-icons";

export type UnmatchProfileModalProps = ThemeProps &
    Partial<CustomModalProps> & {
        onSubmit?: (block: boolean) => void;
        profile: UserProfile | null;
        matchId: string | null;
    };

type UnmatchProfileModalState = {block: boolean};

class UnmatchProfileModal extends React.Component<UnmatchProfileModalProps, UnmatchProfileModalState> {
    constructor(props: UnmatchProfileModalProps) {
        super(props);
        this.state = {block: false};
    }

    render() {
        const {theme, profile, matchId, onSubmit, ...otherProps} = this.props;
        const {block} = this.state;
        const styles = themedStyles(theme);

        return (
            <ConfirmationModal
                title={i18n.t("unmatch.title")}
                text={profile ? i18n.t("unmatch.text", {firstname: profile.firstName, lastname: profile.lastName}) : ""}
                justifyText
                icon={(props) => <MaterialIcons {...props} name="delete-sweep" color={theme.error} />}
                additionalContent={(hide, textProps) => (
                    <>
                        <Text {...textProps}>
                            {profile
                                ? i18n.t("unmatch.blockQuestion", {
                                      firstname: profile.firstName,
                                      lastname: profile.lastName,
                                  })
                                : ""}
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
                            <Text {...textProps}>{i18n.t("block.action")}</Text>
                        </TouchableOpacity>
                    </>
                )}
                buttons={[
                    {preset: "cancel"},
                    {
                        preset: "delete",
                        text: i18n.t("unmatch.action"),
                        onPress: (hide) => {
                            hide();
                            if (matchId) (store.dispatch as MyThunkDispatch)(cancelMatchAction(matchId, true));
                            if (profile && block) (store.dispatch as MyThunkDispatch)(blockProfile(profile.id));
                            if (onSubmit) onSubmit(block);
                        },
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        blockTouchable: {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
        },
        checkboxContainer: {
            padding: 0,
            marginLeft: 0,
            marginRight: 5,
        },
    });
});

export default withTheme(UnmatchProfileModal);
