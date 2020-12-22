import * as React from "react";
import {TouchableOpacity} from "react-native";
import {FontAwesome, MaterialIcons} from "@expo/vector-icons";
import MainHeader, {MainHeaderStackProps} from "./MainHeader";
import {rootNavigate} from "../../navigation/utils";

// Component props
export type MatchScreenHeaderProps = MainHeaderStackProps & {
    backButton?: boolean;
    blur?: boolean;
};

class MatchScreenHeaderClass extends React.Component<MatchScreenHeaderProps> {
    render(): JSX.Element {
        const {backButton, blur, ...stackProps} = this.props;

        return (
            <MainHeader
                {...stackProps}
                backButton={backButton || false}
                blur={blur}
                rightButtons={[
                    ({buttonStyle, iconStyle}) => (
                        <TouchableOpacity style={buttonStyle} onPress={() => rootNavigate("MatchFilteringScreen")}>
                            <FontAwesome name="sliders" style={iconStyle} />
                        </TouchableOpacity>
                    ),
                    ({buttonStyle, iconStyle}) => (
                        <TouchableOpacity style={buttonStyle} onPress={() => rootNavigate("MatchHistoryScreen")}>
                            <MaterialIcons name="history" style={iconStyle} />
                        </TouchableOpacity>
                    ),
                ]}
            />
        );
    }
}

export default function MatchScreenHeader(props: MatchScreenHeaderProps): JSX.Element {
    return <MatchScreenHeaderClass {...props} />;
}
