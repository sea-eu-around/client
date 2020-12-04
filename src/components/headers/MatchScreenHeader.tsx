import * as React from "react";
import {TouchableOpacity} from "react-native";
import {StackHeaderProps} from "@react-navigation/stack";
import {FontAwesome} from "@expo/vector-icons";
import MainHeader from "./MainHeader";

// Component props
export type MatchScreenHeaderProps = StackHeaderProps;

class MatchScreenHeaderClass extends React.Component<MatchScreenHeaderProps> {
    render(): JSX.Element {
        const {...stackProps} = this.props;

        return (
            <MainHeader
                {...stackProps}
                rightButtons={[
                    ({buttonStyle, iconStyle}) => (
                        <TouchableOpacity
                            style={buttonStyle}
                            onPress={() => stackProps.navigation.navigate("MatchFilteringScreen")}
                        >
                            <FontAwesome name="sliders" style={iconStyle} />
                        </TouchableOpacity>
                    ),
                ]}
            />
        );
    }
}

export default function MatchScreenHeader(props: StackHeaderProps): JSX.Element {
    return <MatchScreenHeaderClass {...props} />;
}
