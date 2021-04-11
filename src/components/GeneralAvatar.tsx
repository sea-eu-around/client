import * as React from "react";
import {ActivityIndicator, ImageSourcePropType, View} from "react-native";
import {Avatar, AvatarProps} from "react-native-elements";

// Component props
export type GeneralAvatarProps = {
    name?: string;
    source?: ImageSourcePropType;
    loading?: boolean;
} & AvatarProps;

class GeneralAvatar extends React.Component<GeneralAvatarProps> {
    render(): JSX.Element {
        const {children, name, source, loading, ...avatarProps} = this.props;

        return (
            <Avatar {...avatarProps} title={name} source={source}>
                {children}
                {loading && (
                    <View style={{position: "absolute", left: "50%", top: "50%"}}>
                        <ActivityIndicator size={40} color="white" style={{right: 20, bottom: 20}} />
                    </View>
                )}
            </Avatar>
        );
    }
}

export default GeneralAvatar;
