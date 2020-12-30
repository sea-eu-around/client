import React from "react";
import {Text, View, StyleSheet} from "react-native";
import i18n from "i18n-js";
import {Theme, ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../../styles/utils";
import {UserProfile} from "../../model/user-profile";
import {MyThunkDispatch} from "../../state/types";
import {blockProfile} from "../../state/matching/actions";
import store from "../../state/store";
import CustomModal, {CustomModalClass, CustomModalProps} from "./CustomModal";
import Button from "../Button";

export type BlockProfileModalProps = ThemeProps &
    Partial<CustomModalProps> & {onBlock?: () => void; profile: UserProfile | null};

export class BlockProfileModalClass extends React.Component<BlockProfileModalProps> {
    modalRef = React.createRef<CustomModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {theme, profile, onBlock, ...otherProps} = this.props;
        const styles = themedStyles(theme);
        return (
            <CustomModal
                ref={this.modalRef}
                {...otherProps}
                renderContent={(hide: () => void) =>
                    profile ? (
                        <>
                            <Text style={styles.text}>
                                {i18n.t("block.warning", {firstname: profile.firstName, lastname: profile.lastName})}
                            </Text>
                            <View style={styles.actionButtonsWrapper}>
                                <Button
                                    text={i18n.t("cancel")}
                                    onPress={() => hide()}
                                    skin="rounded-hollow"
                                    style={styles.actionButton}
                                    textStyle={styles.actionText}
                                />
                                <Button
                                    text={i18n.t("block.action")}
                                    onPress={() => {
                                        hide();
                                        (store.dispatch as MyThunkDispatch)(blockProfile(profile.id));
                                        if (onBlock) onBlock();
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
        actionButtonsWrapper: {
            width: "100%",
            flexDirection: "row",
            marginTop: 20,
        },
        actionButton: {
            flex: 1,
            marginHorizontal: 10,
            marginVertical: 0,
        },
        actionText: {
            fontSize: 16,
        },
        redBackground: {
            backgroundColor: theme.error,
        },

        text: {
            fontSize: 16,
            textAlign: "justify",
            color: theme.text,
        },
    });
});

export default withTheme(BlockProfileModalClass);
