import React from "react";
import {StyleSheet} from "react-native";
import {ThemeProps} from "../types";
import {SearchBar, SearchBarProps, withTheme} from "react-native-elements";
import {preTheme} from "../styles/utils";
import {UserProfile} from "../model/user-profile";
import stringSimilarity from "string-similarity";
import i18n from "i18n-js";

// Component props
export type SearchableProfileListProps = {
    profiles: UserProfile[];
    children: (profiles: UserProfile[]) => JSX.Element;
    searchBarProps?: Partial<SearchBarProps>;
} & ThemeProps;

// Component state
export type SearchableProfileListState = {search: string; searchedProfiles: UserProfile[]};

class SearchableProfileList extends React.Component<SearchableProfileListProps, SearchableProfileListState> {
    constructor(props: SearchableProfileListProps) {
        super(props);
        this.state = {search: "", searchedProfiles: props.profiles};
    }

    componentDidMount() {
        this.updateSearch("");
    }

    componentDidUpdate(oldProps: SearchableProfileListProps) {
        if (this.props.profiles.length != oldProps.profiles.length) this.updateSearch(this.state.search);
    }

    updateSearch(search: string) {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        const {profiles} = this.props;

        if (search.length == 0) {
            this.setState({...this.state, search, searchedProfiles: profiles});
        } else if (search.length == 1) {
            this.setState({
                ...this.state,
                search,
                searchedProfiles: profiles.filter((p) => p.firstName.includes(search) || p.lastName.includes(search)),
            });
        } else {
            const similarities: Map<string, number> = new Map();
            profiles.forEach((p: UserProfile) =>
                similarities.set(
                    p.id,
                    /*stringSimilarity.compareTwoStrings(
                        search.toLowerCase(),
                        `${p.firstName} ${p.lastName}`.toLowerCase(),
                    ),*/
                    stringSimilarity.compareTwoStrings(search.toLowerCase(), p.firstName.toLowerCase()) +
                        stringSimilarity.compareTwoStrings(search.toLowerCase(), p.lastName.toLowerCase()),
                ),
            );

            this.setState({
                ...this.state,
                search,
                searchedProfiles: profiles
                    .filter((p) => similarities.get(p.id)! > 0)
                    .sort((a, b) => similarities.get(b.id)! - similarities.get(a.id)!),
            });
        }
    }

    render(): JSX.Element {
        const {theme, searchBarProps} = this.props;
        const {search, searchedProfiles} = this.state;
        const styles = themedStyles(theme);

        const {containerStyle, inputContainerStyle, ...otherSearchBarProps} = searchBarProps || {};

        return (
            <>
                <SearchBar
                    placeholder={i18n.t("search")}
                    onChangeText={(s: string) => this.updateSearch(s)}
                    value={search}
                    containerStyle={[styles.containerStyle, containerStyle]}
                    inputContainerStyle={[styles.inputContainer, inputContainerStyle]}
                    {...otherSearchBarProps}
                />
                {this.props.children(searchedProfiles)}
            </>
        );
    }
}

const themedStyles = preTheme(() => {
    return StyleSheet.create({
        inputContainer: {
            borderRadius: 25,
        },
        containerStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            borderBottomWidth: 0,
            padding: 0,
        },
    });
});

export default withTheme(SearchableProfileList);
