import {Dimensions} from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default {
    window: {
        width,
        height,
    },
    isSmallDevice: width < 375,
    isWideDevice: width / (height + 1) > 0.85,
};
