import * as React from "react";
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from "react-native";
import {withTheme} from "react-native-elements";
import {connect, ConnectedProps} from "react-redux";
import {OfferCategory, OfferDto} from "../api/dto";
import MultiUniversityPicker from "../components/MultiUniversityPicker";
import {setMatchingFilters} from "../state/matching/actions";
import {AppState, MatchingFiltersState} from "../state/types";
import {preTheme} from "../styles/utils";
import {Theme, ThemeProps} from "../types";
import i18n from "i18n-js";
import DegreeToggleMulti from "../components/DegreeToggleMulti";
import LanguagePicker from "../components/LanguagePicker";
import {Degree, Role} from "../constants/profile-constants";
import {MaterialIcons} from "@expo/vector-icons";
import RoleToggleMulti from "../components/RoleToggleMulti";
import {defaultMatchingFilters} from "../state/matching/reducer";
import FormattedOfferCategory from "../components/FormattedOfferCategory";
import ScreenWrapper from "./ScreenWrapper";

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

export const filteringScreenRef = React.createRef<MatchFilteringScreen>();

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

        // <Text style={styles.sectionTitle}>{i18n.t(`offerCategories.${category}`)}</Text>
        const offerSections = categories.map((category: OfferCategory) => (
            <View key={category} style={styles.sectionContainer}>
                <Separator />
                <FormattedOfferCategory category={category} iconSize={60} fontSize={24} />
                {offers
                    .filter((o: OfferDto) => o.category == category)
                    .map((o: OfferDto) => (
                        <View key={o.id} style={styles.entryContainer}>
                            <Text style={styles.entryLabel}>{i18n.t(`allOffers.${o.id}.name`)}</Text>
                            <Switch
                                value={filters.offers[o.id] || false}
                                onValueChange={(value: boolean) => this.updateLocalOfferFilters(o.id, value)}
                            />
                        </View>
                    ))}
            </View>
        ));

        return (
            <ScreenWrapper>
                <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
                    <TouchableOpacity style={styles.resetButton} onPress={() => this.resetLocalFilters()}>
                        <Text style={styles.resetButtonText}>{i18n.t("matching.filtering.buttonReset")}</Text>
                        <MaterialIcons name="refresh" style={styles.resetButtonIcon} />
                    </TouchableOpacity>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>{i18n.t("matching.filtering.sectionGeneral")}</Text>
                        <View style={styles.entryContainer}>
                            <Text style={styles.entryLabel}>{i18n.t("university")}</Text>
                            <View style={styles.entryControls}>
                                <MultiUniversityPicker
                                    universities={filters.universities}
                                    showChips={false}
                                    onChange={(universities: string[]) => this.updateLocalFilters({universities})}
                                />
                                <ClearFilterButton onPress={() => this.updateLocalFilters({universities: []})} />
                            </View>
                        </View>
                        <View style={styles.entryContainer}>
                            <Text style={styles.entryLabel}>{i18n.t("spokenLanguages")}</Text>
                            <View style={styles.entryControls}>
                                <LanguagePicker
                                    multiple={true}
                                    languages={filters.languages}
                                    showChips={false}
                                    onChange={(languages: string[]) => this.updateLocalFilters({languages})}
                                />
                                <ClearFilterButton onPress={() => this.updateLocalFilters({languages: []})} />
                            </View>
                        </View>
                        <View style={styles.twoLineEntryContainer}>
                            <Text style={styles.entryLabel}>{i18n.t("profileTypes")}</Text>
                            <RoleToggleMulti
                                roles={filters.types}
                                onSelect={(types: Role[]) => this.updateLocalFilters({types})}
                                styleVariant="classic-rounded"
                            />
                        </View>
                        {filters.types.indexOf("student") != -1 && (
                            <View style={styles.twoLineEntryContainer}>
                                <Text style={styles.entryLabel}>{i18n.t("levelOfStudy")}</Text>
                                <DegreeToggleMulti
                                    degrees={filters.degrees}
                                    onSelect={(degrees: Degree[]) => this.updateLocalFilters({degrees})}
                                    style={{width: "100%"}}
                                    styleVariant="classic-rounded"
                                />
                            </View>
                        )}
                    </View>
                    {offerSections}
                </ScrollView>
            </ScreenWrapper>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        scroll: {
            width: "100%",
        },
        scrollContainer: {
            flexDirection: "column",
            padding: 40,
            width: "100%",
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
        entryControls: {
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 2,
        },
        separator: {
            height: 1,
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            alignSelf: "center",
            marginVertical: 15,
        },
        resetButton: {
            width: "100%",
            maxWidth: 200,
            paddingVertical: 7,
            marginBottom: 20,
            backgroundColor: theme.accentSlight,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            borderRadius: 50,
            elevation: 1,
        },
        resetButtonText: {
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: theme.textBlack,
        },
        resetButtonIcon: {
            fontSize: 16,
            color: theme.textBlack,
            marginLeft: 4,
        },
    });
});

export const ClearFilterButton = withTheme(
    ({theme, onPress}: ThemeProps & {onPress: () => void}): JSX.Element => (
        <TouchableOpacity onPress={onPress}>
            <MaterialIcons name="close" style={{fontSize: 28, color: theme.text}} />
        </TouchableOpacity>
    ),
);

const wrapper = (props: MatchFilteringScreenProps) => <MatchFilteringScreen ref={filteringScreenRef} {...props} />;
export default reduxConnector(withTheme(wrapper));
