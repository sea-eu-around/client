import * as React from "react";

import {Text, View} from "react-native";
import i18n from "i18n-js";
import {Gender, GENDERS} from "../constants/profile-constants";
import {ButtonGroup} from "react-native-elements";

export type GenderToggleProps = {
    gender: Gender;
    onSelect?: (gender: Gender) => void;
};

export function GenderToggle(props: GenderToggleProps): JSX.Element {
    const buttonLabels = GENDERS.map((r: string) => i18n.t(`genders.${r}`));
    const {gender} = props;

    const onUpdate = (idx: number) => {
        if (props.onSelect) props.onSelect(GENDERS[idx]);
    };

    return (
        <View style={{width: "100%"}}>
            <Text>{i18n.t("gender")}</Text>
            <ButtonGroup
                onPress={onUpdate}
                selectedIndex={GENDERS.indexOf(gender)}
                buttons={buttonLabels}
                containerStyle={{height: 40, marginLeft: 0, marginRight: 0}}
            />
        </View>
    );
}