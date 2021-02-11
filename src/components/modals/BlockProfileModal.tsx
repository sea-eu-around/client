import React from "react";
import i18n from "i18n-js";
import {ThemeProps} from "../../types";
import {withTheme} from "react-native-elements";
import {UserProfile} from "../../model/user-profile";
import {MyThunkDispatch} from "../../state/types";
import {blockProfile} from "../../state/matching/actions";
import store from "../../state/store";
import {CustomModalClass, CustomModalProps} from "./CustomModal";
import ConfirmationModal from "./ConfirmationModal";
import {MaterialIcons} from "@expo/vector-icons";

export type BlockProfileModalProps = ThemeProps &
    Partial<CustomModalProps> & {onBlock?: () => void; profile: UserProfile | null};

export class BlockProfileModalClass extends React.Component<BlockProfileModalProps> {
    modalRef = React.createRef<CustomModalClass>();

    show(): void {
        this.modalRef.current?.show();
    }

    render(): JSX.Element {
        const {theme, profile, onBlock, ...otherProps} = this.props;

        return (
            <ConfirmationModal
                title={i18n.t("block.title")}
                text={
                    profile ? i18n.t("block.warning", {firstname: profile.firstName, lastname: profile.lastName}) : ""
                }
                icon={(props) => <MaterialIcons name="block" color={theme.error} {...props} />}
                buttons={[
                    {preset: "cancel"},
                    {
                        preset: "delete",
                        text: i18n.t("block.action"),
                        onPress: (hide) => {
                            hide();
                            if (profile) (store.dispatch as MyThunkDispatch)(blockProfile(profile.id));
                            if (onBlock) onBlock();
                        },
                    },
                ]}
                {...otherProps}
            />
        );
    }
}

export default withTheme(BlockProfileModalClass);
