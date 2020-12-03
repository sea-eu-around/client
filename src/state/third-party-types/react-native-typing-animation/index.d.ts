declare module "react-native-typing-animation" {
    import {StyleProp, ViewStyle} from "react-native";

    export type TypingAnimationProps = {
        style?: StyleProp<ViewStyle>;
        dotStyles?: StyleProp<ViewStyle>;
        dotColor?: string;
        dotMargin?: number;
        dotAmplitude?: number;
        dotSpeed?: number;
        dotRadius?: number;
        dotY?: number;
        dotX?: number;
    };

    export class TypingAnimation extends React.Component<TypingAnimationProps> {}
}
