import * as React from "react";
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from "react-native";
import {withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {OfferCategory, OfferDto} from "../api/dto";
import MultiUniversityPicker from "../components/MultiUniversityPicker";
import {refreshFetchedProfiles, setMatchingFilters} from "../state/matching/actions";
import {AppState, MatchingFiltersState} from "../state/types";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import i18n from "i18n-js";
import DegreeToggleMulti from "../components/DegreeToggleMulti";
import MultiLanguagePicker from "../components/MultiLanguagePicker";
import {Degree, Role} from "../constants/profile-constants";
import {MaterialIcons} from "@expo/vector-icons";
import store from "../state/store";
import RoleToggleMulti from "../components/RoleToggleMulti";
import {StackHeaderLeftButtonProps} from "@react-navigation/stack";
import {defaultMatchingFilters} from "../state/matching/reducer";
import {rootNavigate} from "../navigation/utils";

// Map props from state
const reduxConnector = connect((state: AppState) => ({
    offers: state.profile.offers,
    filters: state.matching.filters,
}));

// Component props
type MatchFilteringScreenProps = ThemeProps & ConnectedProps<typeof reduxConnector>;

// Component state
type MatchFilteringScreenState = {
    localFilters: MatchingFiltersState;
};

export const Separator = withTheme(({theme}: ThemeProps) => {
    return <View style={themedStyles(theme).separator}></View>;
});

const filteringScreenRef = React.createRef<MatchFilteringScreen>();

class MatchFilteringScreen extends React.Component<MatchFilteringScreenProps, MatchFilteringScreenState> {
    haveFiltersChanged: boolean;

    constructor(props: MatchFilteringScreenProps) {
        super(props);
        this.state = {
            localFilters: defaultMatchingFilters(),
        };
        this.haveFiltersChanged = false;
    }

    updateLocalOfferFilters(id: string, value: boolean) {
        this.haveFiltersChanged = true;
        this.setState({
            ...this.state,
            localFilters: {...this.state.localFilters, offers: {...this.state.localFilters.offers, [id]: value}},
        });
    }

    updateLocalFilters(filters: Partial<MatchingFiltersState>) {
        this.haveFiltersChanged = true;
        this.setState({...this.state, localFilters: {...this.state.localFilters, ...filters}});
    }

    resetLocalFilters() {
        this.updateLocalFilters(defaultMatchingFilters());
    }

    applyFilters() {
        if (this.haveFiltersChanged) this.props.dispatch(setMatchingFilters(this.state.localFilters));
    }

    componentDidMount() {
        // Set filters from the store when mounting
        this.updateLocalFilters(this.props.filters);
        this.haveFiltersChanged = false;
    }

    render(): JSX.Element {
        const {theme, offers} = this.props;
        const filters = this.state.localFilters;
        const styles = themedStyles(theme);

        const categories = Object.values(OfferCategory);

        const offerSections = categories.map((category: OfferCategory) => (
            <View key={category} style={styles.sectionContainer}>
                <Separator></Separator>
                <Text style={styles.sectionTitle}>{i18n.t(`offerCategories.${category}`)}</Text>
                {offers
                    .filter((o: OfferDto) => o.category == category)
                    .map((o: OfferDto) => (
                        <View key={o.id} style={styles.entryContainer}>
                            <Text style={styles.entryLabel}>{i18n.t(`offers.${o.id}.name`)}</Text>
                            <Switch
                                value={filters.offers[o.id] || false}
                                onValueChange={(value: boolean) => this.updateLocalOfferFilters(o.id, value)}
                            ></Switch>
                        </View>
                    ))}
            </View>
        ));

        return (
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity style={styles.resetButton} onPress={() => this.resetLocalFilters()}>
                    <Text style={styles.resetButtonText}>{i18n.t("matching.filtering.buttonReset")}</Text>
                </TouchableOpacity>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>{i18n.t("matching.filtering.sectionGeneral")}</Text>
                    <View style={styles.entryContainer}>
                        <Text style={styles.entryLabel}>{i18n.t("university")}</Text>
                        <MultiUniversityPicker
                            universities={filters.universities}
                            showSelected={false}
                            onChange={(universities: string[]) => this.updateLocalFilters({universities})}
                        ></MultiUniversityPicker>
                    </View>
                    <View style={styles.entryContainer}>
                        <Text style={styles.entryLabel}>{i18n.t("spokenLanguages")}</Text>
                        <MultiLanguagePicker
                            languages={filters.languages}
                            showSelected={false}
                            onChange={(languages: string[]) => this.updateLocalFilters({languages})}
                        ></MultiLanguagePicker>
                    </View>
                    <View style={styles.twoLineEntryContainer}>
                        <Text style={styles.entryLabel}>{i18n.t("roles")}</Text>
                        <RoleToggleMulti
                            roles={filters.roles}
                            onSelect={(roles: Role[]) => this.updateLocalFilters({roles})}
                            noButtonVariant={true}
                        ></RoleToggleMulti>
                    </View>
                    {filters.roles.indexOf("student") != -1 && (
                        <View style={styles.twoLineEntryContainer}>
                            <Text style={styles.entryLabel}>{i18n.t("levelOfStudy")}</Text>
                            <DegreeToggleMulti
                                degrees={filters.degrees}
                                onSelect={(degrees: Degree[]) => this.updateLocalFilters({degrees})}
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
            color: theme.text,
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
            color: theme.textLight,
        },
        separator: {
            height: 1,
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            alignSelf: "center",
            marginVertical: 20,
        },
        resetButton: {
            width: "100%",
            maxWidth: 200,
            paddingVertical: 7,
            marginBottom: 20,
            backgroundColor: theme.accentSlight,
            alignItems: "center",
            alignSelf: "center",
            borderRadius: 4,
            elevation: 1,
        },
        resetButtonText: {
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: 1,
        },
    });
});

const headerStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        headerButtonIcon: {
            fontSize: 32,
            paddingRight: 10,
            color: theme.text,
        },
    });
});

export const FilteringHeaderLeft = withTheme(
    (props: StackHeaderLeftButtonProps & ThemeProps): JSX.Element => {
        const styles = headerStyles(props.theme);
        return (
            <TouchableOpacity style={{padding: 10}} onPress={props.onPress}>
                <MaterialIcons name="close" style={styles.headerButtonIcon} />
            </TouchableOpacity>
        );
    },
);

export const FilteringHeaderRight = withTheme(
    ({theme}: ThemeProps): JSX.Element => {
        const styles = headerStyles(theme);
        return (
            <TouchableOpacity
                style={{paddingVertical: 10}}
                onPress={() => {
                    if (filteringScreenRef.current) filteringScreenRef.current.applyFilters();
                    rootNavigate("TabMatchingScreen");
                    store.dispatch(refreshFetchedProfiles());
                }}
            >
                <MaterialIcons name="check" style={styles.headerButtonIcon} />
            </TouchableOpacity>
        );
    },
);

//return <MaterialIcons name="refresh" size={32} style={{paddingRight: 10}} />;
/*
<TouchableOpacity style={{marginRight: 16, padding: 10}} onPress={() => store.dispatch(resetMatchingFilters())}>
    <Text>reset</Text>
</TouchableOpacity>
*/

const wrapper = (props: MatchFilteringScreenProps) => <MatchFilteringScreen ref={filteringScreenRef} {...props} />;
export default reduxConnector(withTheme(wrapper));
