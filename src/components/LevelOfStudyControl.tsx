import * as React from "react";

import {LEVELS_OF_STUDY} from "../constants/profile-constants";
import {ButtonGroup} from "react-native-elements";

export type LevelOfStudyControlProps = {
    levelIndex: number;
    onUpdateIndex?: (levelIndex: number) => void;
};

export class LevelOfStudyControl extends React.Component<LevelOfStudyControlProps> {
    render(): JSX.Element {
        const buttonLabels = LEVELS_OF_STUDY;
        const {levelIndex} = this.props;

        return (
            <ButtonGroup
                onPress={(idx: number) => {
                    if (this.props.onUpdateIndex) this.props.onUpdateIndex(idx);
                }}
                selectedIndex={levelIndex}
                buttons={buttonLabels}
                containerStyle={{height: 35, marginLeft: 0, marginRight: 0}}
            />
        );
    }
}
