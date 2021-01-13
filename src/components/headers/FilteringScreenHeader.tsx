import * as React from "react";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {withTheme} from "react-native-elements";
import {Theme, ThemeProps} from "../../types";
import {StackHeaderProps} from "@react-navigation/stack";
import {MaterialIcons} from "@expo/vector-icons";
import {headerStyles} from "../../styles/headers";
import {headerTitle} from "../../navigation/utils";
import {NavigatorRoute} from "../../navigation/types";
import {preTheme} from "../../styles/utils";
import store from "../../state/store";
import {filteringScreenRef} from "../../screens/MatchFilteringScreen";
import {refreshFetchedProfiles} from "../../state/matching/actions";

// Component props
export type FilteringScreenHeaderProps = ThemeProps & StackHeaderProps;

class FilteringScreenHeaderClass extends React.Component<FilteringScreenHeaderProps> {
    back() {
        const nav = this.props.navigation;
        if (nav.canGoBack()) nav.goBack();
    }

    render(): JSX.Element {
        const {theme, insets, scene, navigation} = this.props;
        const styles = themedStyles(theme);
        const hstyles = headerStyles(theme);

        const title = headerTitle(scene.route.name as NavigatorRoute);

        return (
            <View style={[{paddingTop: insets.top}, hstyles.wrapper]}>
                <TouchableOpacity style={{}} onPress={() => this.back()}>
                    <MaterialIcons name="close" style={styles.actionIcon} />
                </TouchableOpacity>
                <Text style={[hstyles.title, {textAlign: "center"}]} numberOfLines={1}>
                    {title}
                </Text>
                <TouchableOpacity
                    style={{paddingVertical: 10}}
                    onPress={() => {
                        if (filteringScreenRef.current) filteringScreenRef.current.applyFilters();
                        navigation.navigate("TabMatchingScreen");
                        store.dispatch(refreshFetchedProfiles());
                    }}
                >
                    <MaterialIcons name="check" style={styles.actionIcon} />
                </TouchableOpacity>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        actionIcon: {
            fontSize: 28,
            color: theme.text,
        },
    });
});

const FilteringScreenHeaderComp = withTheme(FilteringScreenHeaderClass);

export default function FilteringScreenHeader(props: StackHeaderProps): JSX.Element {
    return <FilteringScreenHeaderComp {...props} />;
}
