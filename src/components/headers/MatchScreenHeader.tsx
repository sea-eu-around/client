import * as React from "react";
import {TouchableOpacity} from "react-native";
import {StackHeaderProps} from "@react-navigation/stack";
import {FontAwesome, MaterialIcons} from "@expo/vector-icons";
import MainHeader from "./MainHeader";

// Component props
export type MatchScreenHeaderProps = StackHeaderProps & {backButton?: boolean};

class MatchScreenHeaderClass extends React.Component<MatchScreenHeaderProps> {
    render(): JSX.Element {
        const {backButton, ...stackProps} = this.props;

        return (
            <MainHeader
                {...stackProps}
                backButton={backButton || false}
                rightButtons={[
                    ({buttonStyle, iconStyle}) => (
                        <TouchableOpacity
                            style={buttonStyle}
                            onPress={() => stackProps.navigation.navigate("MatchFilteringScreen")}
                        >
                            <FontAwesome name="sliders" style={iconStyle} />
                        </TouchableOpacity>
                    ),
                    ({buttonStyle, iconStyle}) => (
                        <TouchableOpacity
                            style={buttonStyle}
                            onPress={() => stackProps.navigation.navigate("MatchHistoryScreen")}
                        >
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
