import * as React from "react";
import {AvatarProps} from "react-native-elements";
import {ChatRoomUser} from "../model/chat-room";
import GeneralAvatar from "./GeneralAvatar";

// Component props
export type ChatUserAvatarProps = {user?: ChatRoomUser} & AvatarProps;

class ChatUserAvatar extends React.Component<ChatUserAvatarProps> {
    render(): JSX.Element {
        const {children, user, ...avatarProps} = this.props;

        let name = undefined;

        // Extract initials
        if (user) {
            const split = user.name.split(" ");
            name = split[0][0];
            if (split.length > 0) name += split[1][0];
            name = name.toUpperCase();
        }

        const sourceProp = user && user.avatar.length > 0 ? {source: {uri: user.avatar}} : {};

        return (
            <GeneralAvatar {...avatarProps} name={name} {...sourceProp}>
                {children}
            </GeneralAvatar>
        );
    }
}

export default ChatUserAvatar;
