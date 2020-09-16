import * as React from "react";

import {Text, View} from "react-native";
import {LEVELS_OF_STUDY} from "../constants/profile-constants";
import {ButtonGroup} from "react-native-elements";
import i18n from "i18n-js";

export type LevelOfStudyControlProps = {
    levelIndex: number;
    onUpdateIndex?: (levelIndex: number) => void;
};

export class LevelOfStudyControl extends React.Component<LevelOfStudyControlProps> {
    render(): JSX.Element {
        const buttonLabels = LEVELS_OF_STUDY;
        const {levelIndex} = this.props;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const onUpdate = this.props.onUpdateIndex || (() => {});

        return (
            <View style={{flex: 1, width: "100%"}}>
                <Text>{i18n.t("levelOfStudy")}</Text>
                <ButtonGroup
                    onPress={onUpdate}
                    selectedIndex={levelIndex}
                    buttons={buttonLabels}
                    containerStyle={{height: 40, marginLeft: 0, marginRight: 0}}
                />
            </View>
        );
    }
}
