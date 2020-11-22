import React from "react";
import {Text, View, StyleSheet, ViewStyle, TouchableOpacity} from "react-native";
import {initOfferValue, OfferDto, OfferValueDto} from "../api/dto";
import {Gender, Role} from "../constants/profile-constants";
import GenderToggleMulti from "./GenderToggleMulti";
import RoleToggleMulti from "./RoleToggleMulti";
import i18n from "i18n-js";
import {MaterialIcons} from "@expo/vector-icons";
import CustomTooltip from "./CustomTooltip";
import {Theme, ThemeProps} from "../types";
import {withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import CheckBox from "@react-native-community/checkbox";

export type OfferControlProps = {
    offer: OfferDto;
    value: OfferValueDto;
    onChange?: (value: OfferValueDto) => void;
    style?: ViewStyle;
} & ThemeProps;

class OfferControl extends React.Component<OfferControlProps> {
    offerValueChange(changed: Partial<OfferValueDto>): void {
        const {onChange} = this.props;
        if (onChange) onChange({...this.props.value, ...changed});
    }

    setAllValues(b: boolean) {
        this.offerValueChange(initOfferValue(this.props.offer, b));
    }

    render(): JSX.Element {
        const {theme, offer, value, style} = this.props;
        const styles = themedStyles(theme);

        const genders: Gender[] = [];
        if (offer.allowChooseGender) {
            if (value.allowFemale) genders.push("female");
            if (value.allowMale) genders.push("male");
            if (value.allowOther) genders.push("other");
        }

        const roles: Role[] = [];
        if (offer.allowChooseProfileType) {
            if (value.allowStaff) roles.push("staff");
            if (value.allowStudent) roles.push("student");
        }

        const isSomethingSelected =
            (!offer.allowChooseGender || genders.length > 0) && (!offer.allowInterRole || roles.length > 0);
        console.log(value);
        return (
            <View style={[styles.wrapper, style]}>
                <View style={styles.titleWrapper}>
                    <CheckBox
                        value={isSomethingSelected}
                        onValueChange={(value: boolean) => this.setAllValues(value)}
                    ></CheckBox>
                    <TouchableOpacity onPress={() => this.setAllValues(!isSomethingSelected)}>
                        <Text style={styles.offerName}>{i18n.t(`allOffers.${offer.id}.name`)}</Text>
                    </TouchableOpacity>
                    <CustomTooltip text={i18n.t(`allOffers.${offer.id}.help`)}>
                        <MaterialIcons style={styles.helpIcon} name="help"></MaterialIcons>
                    </CustomTooltip>
                </View>
                {isSomethingSelected && (
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
                        {offer.allowChooseProfileType && (
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
                )}
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
            alignItems: "center",
        },
        offerName: {
            textTransform: "uppercase",
            letterSpacing: 1,
            color: theme.text,
        },
        helpIcon: {
            fontSize: 20,
            marginLeft: 5,
            color: theme.textLight,
        },
        buttonsWrapper: {
            width: "100%",
        },
    });
});

export default withTheme(OfferControl);
