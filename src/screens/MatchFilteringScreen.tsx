import * as React from "react";
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from "react-native";
import {withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {OfferCategory, OfferDto} from "../api/dto";
import MultiUniversityPicker from "../components/MultiUniversityPicker";
import {resetMatchingFilters, setMatchingFilters, setOfferFilter} from "../state/matching/actions";
import {AppState} from "../state/types";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import i18n from "i18n-js";
import DegreeToggleMulti from "../components/DegreeToggleMulti";
import MultiLanguagePicker from "../components/MultiLanguagePicker";
import {Degree, Role} from "../constants/profile-constants";
import {MaterialIcons} from "@expo/vector-icons";
import store from "../state/store";
import RoleToggleMulti from "../components/RoleToggleMulti";

// Map props from state
const reduxConnector = connect((state: AppState) => ({
    offers: state.profile.offers,
    filters: state.matching.filters,
}));

// Component props
type MatchFilteringScreenProps = ThemeProps & ConnectedProps<typeof reduxConnector>;

export const Separator = withTheme(({theme}: ThemeProps) => {
    return <View style={themedStyles(theme).separator}></View>;
});

class MatchFilteringScreen extends React.Component<MatchFilteringScreenProps> {
    render(): JSX.Element {
        const {theme, offers, filters, dispatch} = this.props;
        const styles = themedStyles(theme);

        const categories = Object.values(OfferCategory);

        const offerSections = categories.map((category: OfferCategory) => (
            <View key={category} style={styles.sectionContainer}>
                <Separator></Separator>
                <Text style={styles.sectionTitle}>{category}</Text>
                {offers
                    .filter((o: OfferDto) => o.category == category)
                    .map((o: OfferDto) => (
                        <View key={o.id} style={styles.entryContainer}>
                            <Text style={styles.entryLabel}>{o.id}</Text>
                            <Switch
                                value={filters.offers[o.id] || false}
                                onValueChange={(value: boolean) => dispatch(setOfferFilter(o.id, value))}
                            ></Switch>
                        </View>
                    ))}
            </View>
        ));

        return (
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>General</Text>
                    <View style={styles.entryContainer}>
                        <Text style={styles.entryLabel}>University</Text>
                        <MultiUniversityPicker
                            universities={filters.universities}
                            showSelected={false}
                            onChange={(universities: string[]) => dispatch(setMatchingFilters({universities}))}
                        ></MultiUniversityPicker>
                    </View>
                    <View style={styles.entryContainer}>
                        <Text style={styles.entryLabel}>{i18n.t("spokenLanguages")}</Text>
                        <MultiLanguagePicker
                            languages={filters.languages}
                            showSelected={false}
                            onChange={(languages: string[]) => dispatch(setMatchingFilters({languages}))}
                        ></MultiLanguagePicker>
                    </View>
                    <View style={styles.twoLineEntryContainer}>
                        <Text style={styles.entryLabel}>{i18n.t("roles")}</Text>
                        <RoleToggleMulti
                            roles={filters.roles}
                            onSelect={(roles: Role[]) => dispatch(setMatchingFilters({roles}))}
                            noButtonVariant={true}
                        ></RoleToggleMulti>
                    </View>
                    {filters.roles.indexOf("student") != -1 && (
                        <View style={styles.twoLineEntryContainer}>
                            <Text style={styles.entryLabel}>{i18n.t("levelOfStudy")}</Text>
                            <DegreeToggleMulti
                                degrees={filters.degrees}
                                onSelect={(degrees: Degree[]) => dispatch(setMatchingFilters({degrees}))}
                                style={{width: "100%"}}
                                noButtonVariant={true}
                            ></DegreeToggleMulti>
                        </View>
                    )}
                </View>
                {offerSections}
            </ScrollView>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        scroll: {
            flex: 1,
            backgroundColor: theme.background,
        },
        scrollContainer: {
            //alignItems: "center",
            //justifyContent: "center",
            flexDirection: "column",
            padding: 40,
        },
        sectionContainer: {
            width: "100%",
        },
        sectionTitle: {
            fontSize: 20,
            letterSpacing: 1,
            marginBottom: 5,
        },
        entryContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        twoLineEntryContainer: {
            flexDirection: "column",
        },
        entryLabel: {
            fontSize: 16,
            marginVertical: 7,
            marginRight: 10,
        },
        separator: {
            height: 1,
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            alignSelf: "center",
            marginVertical: 20,
        },
    });
});

export const FilteringHeaderBackImage = (): JSX.Element => {
    return <MaterialIcons name="close" size={32} />;
};
export const FilteringHeaderRight = (): JSX.Element => {
    //return <MaterialIcons name="refresh" size={32} style={{paddingRight: 10}} />;
    return (
        <TouchableOpacity style={{marginRight: 16, padding: 10}} onPress={() => store.dispatch(resetMatchingFilters())}>
            <Text>reset</Text>
        </TouchableOpacity>
    );
};

export default reduxConnector(withTheme(MatchFilteringScreen));
