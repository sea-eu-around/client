import React from "react";
import {Text, View, StyleSheet, ViewStyle} from "react-native";
import {OfferDto, OfferValueDto} from "../api/dto";
import {Gender, Role} from "../constants/profile-constants";
import GenderToggleMulti from "./GenderToggleMulti";
import RoleToggleMulti from "./RoleToggleMulti";
import i18n from "i18n-js";
import {MaterialIcons} from "@expo/vector-icons";
import CustomTooltip from "./CustomTooltip";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";

export type OfferControlProps = {
    offer: OfferDto;
    value: OfferValueDto;
    onChange?: (value: Partial<OfferValueDto>) => void;
    style?: ViewStyle;
} & ThemeProps;

class OfferControl extends React.Component<OfferControlProps> {
    offerValueChange(value: Partial<OfferValueDto>): void {
        const {onChange} = this.props;
        if (onChange) onChange(value);
    }

    render(): JSX.Element {
        const {theme, offer, value, style} = this.props;
        const styles = themedStyles(theme);

        const genders: Gender[] = [];
        if (value.allowFemale) genders.push("female");
        if (value.allowMale) genders.push("male");
        if (value.allowOther) genders.push("other");

        const roles: Role[] = [];
        if (value.allowStaff) roles.push("staff");
        if (value.allowStudent) roles.push("student");

        return (
            <View style={[styles.wrapper, style]}>
                <View style={styles.titleWrapper}>
                    <CustomTooltip text={i18n.t(`offers.${offer.id}.help`)}>
                        <MaterialIcons style={styles.helpIcon} name="help"></MaterialIcons>
                    </CustomTooltip>
                    <Text style={styles.offerName}>{i18n.t(`offers.${offer.id}.name`)}</Text>
                </View>
                <View style={styles.buttonsWrapper}>
                    {offer.allowChooseGender && (
                        <GenderToggleMulti
                            noButtonVariant={true}
                            genders={genders}
                            onSelect={(selected: Gender[]) =>
                                this.offerValueChange({
                                    allowFemale: selected.indexOf("female") != -1,
                                    allowMale: selected.indexOf("male") != -1,
                                    allowOther: selected.indexOf("other") != -1,
                                })
                            }
                        />
                    )}
                    {offer.allowChooseRole && (
                        <RoleToggleMulti
                            noButtonVariant={true}
                            roles={roles}
                            onSelect={(selected: Role[]) =>
                                this.offerValueChange({
                                    allowStaff: selected.indexOf("staff") != -1,
                                    allowStudent: selected.indexOf("student") != -1,
                                })
                            }
                        />
                    )}
                </View>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        wrapper: {
            flexDirection: "column",
            alignItems: "flex-start",
        },
        titleWrapper: {
            flexDirection: "row",
        },
        offerName: {
            textTransform: "uppercase",
            letterSpacing: 1,
            color: theme.text,
        },
        helpIcon: {
            fontSize: 20,
            marginRight: 5,
            color: theme.textLight,
        },
        buttonsWrapper: {
            flexDirection: "row",
        },
    });
});

export default withTheme(OfferControl);

/*
<Tooltip
    popover={
        <Text
            style={tooltipStyles.text}
            onLayout={(e) => {
                console.log(e.nativeEvent.layout.height);
                this.forceUpdate();
            }}
        >
            {i18n.t(`offers.${offer.id}.help`)}
        </Text>
    }
    backgroundColor={theme.accentSlight}
    containerStyle={tooltipStyles.container}
    height={100}
>
    <MaterialIcons style={styles.helpIcon} name="help"></MaterialIcons>
</Tooltip>
*/
