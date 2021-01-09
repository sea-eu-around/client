import React from "react";
import {Text, View, StyleSheet, ViewStyle, TouchableOpacity} from "react-native";
import {initOfferValue, OfferDto, OfferValueDto} from "../api/dto";
import {Gender, Role} from "../constants/profile-constants";
import GenderToggleMulti from "./GenderToggleMulti";
import RoleToggleMulti from "./RoleToggleMulti";
import i18n from "i18n-js";
import {FontAwesome, MaterialIcons} from "@expo/vector-icons";
import CustomTooltip from "./CustomTooltip";
import {Theme, ThemeProps} from "../types";
import {CheckBox, withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import CustomModal, {CustomModalClass} from "./modals/CustomModal";
import InputLabel from "./InputLabel";
import Button from "./Button";

export type OfferControlProps = {
    offer: OfferDto;
    value: OfferValueDto;
    onChange?: (value: OfferValueDto) => void;
    style?: ViewStyle;
} & ThemeProps;

class OfferControl extends React.Component<OfferControlProps> {
    settingsModalRef = React.createRef<CustomModalClass>();

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

        return (
            <View style={[styles.wrapper, style]}>
                <View style={styles.titleWrapper}>
                    <View style={styles.titleLeft}>
                        <CheckBox
                            checked={isSomethingSelected}
                            onPress={() => this.setAllValues(!isSomethingSelected)}
                            containerStyle={styles.checkboxContainer}
                        />
                        <TouchableOpacity
                            style={styles.offerNameTouchable}
                            onPress={() => this.setAllValues(!isSomethingSelected)}
                        >
                            <Text style={styles.offerName}>{i18n.t(`allOffers.${offer.id}.name`)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity
                            style={styles.sideButton}
                            onPress={() => this.settingsModalRef.current?.show()}
                        >
                            <FontAwesome style={styles.sideButtonIcon} name="gear" />
                        </TouchableOpacity>
                        <CustomTooltip text={i18n.t(`allOffers.${offer.id}.help`)}>
                            <MaterialIcons style={[styles.sideButton, styles.sideButtonIcon]} name="help" />
                        </CustomTooltip>
                    </View>
                </View>
                {/*isSomethingSelected && (
                    <View style={styles.buttonsWrapper}>
                        {offer.allowChooseGender && (
                            <GenderToggleMulti
                                styleVariant="chips"
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
                                styleVariant="chips"
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
                )*/}
                <CustomModal
                    ref={this.settingsModalRef}
                    modalViewStyle={styles.settingsModal}
                    renderContent={(hide: () => void) => (
                        <>
                            {offer.allowChooseGender && (
                                <View style={styles.settingsModalTargetType}>
                                    <InputLabel>{i18n.t("offerSettings.genders")}</InputLabel>
                                    <GenderToggleMulti
                                        styleVariant="classic-rounded"
                                        genders={genders}
                                        onSelect={(selected: Gender[]) =>
                                            this.offerValueChange({
                                                allowFemale: selected.indexOf("female") != -1,
                                                allowMale: selected.indexOf("male") != -1,
                                                allowOther: selected.indexOf("other") != -1,
                                            })
                                        }
                                    />
                                </View>
                            )}

                            {offer.allowChooseProfileType && (
                                <View style={styles.settingsModalTargetType}>
                                    <InputLabel>{i18n.t("offerSettings.roles")}</InputLabel>
                                    <RoleToggleMulti
                                        styleVariant="classic-rounded"
                                        roles={roles}
                                        onSelect={(selected: Role[]) =>
                                            this.offerValueChange({
                                                allowStaff: selected.indexOf("staff") != -1,
                                                allowStudent: selected.indexOf("student") != -1,
                                            })
                                        }
                                    />
                                </View>
                            )}
                            <Button
                                style={styles.settingsModalButton}
                                textStyle={styles.settingsModalButtonText}
                                skin="rounded-filled"
                                text={i18n.t("ok")}
                                onPress={hide}
                            />
                        </>
                    )}
                />
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
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        titleLeft: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        offerNameTouchable: {
            flex: 1,
        },
        offerName: {
            textTransform: "uppercase",
            letterSpacing: 1,
            color: theme.text,
        },
        sideButton: {
            paddingVertical: 10,
            paddingHorizontal: 5,
        },
        sideButtonIcon: {
            fontSize: 20,
            color: theme.textLight,
        },
        checkboxContainer: {
            padding: 0,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 5,
        },

        settingsModal: {
            paddingVertical: 20,
            paddingHorizontal: 15,
            alignItems: "flex-start",
        },
        settingsModalTargetType: {
            width: "100%",
            marginBottom: 10,
        },
        settingsModalButton: {
            height: 38,
            marginHorizontal: 5,
            marginVertical: 0,
            marginTop: 20,
        },
        settingsModalButtonText: {
            fontSize: 16,
        },
    });
});

export default withTheme(OfferControl);
