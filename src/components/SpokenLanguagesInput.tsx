import * as React from "react";
import i18n from "i18n-js";
import {connect, ConnectedProps} from "react-redux";
import {AppState} from "../state/types";
import themes from "../constants/themes";
import {Text, TouchableOpacity, View, ViewStyle, StyleSheet} from "react-native";
import LanguagePicker from "./LanguagePicker";
import LanguageLevelPicker from "./LanguageLevelPicker";
import InputErrorText from "./InputErrorText";
import {SpokenLanguage} from "../model/spoken-language";
import {MaterialIcons} from "@expo/vector-icons";

// Map props from store
const reduxConnector = connect((state: AppState) => ({
    theme: themes[state.settings.theme],
}));

// Component props
export type SpokenLanguagesInputProps = ConnectedProps<typeof reduxConnector> & {
    languages: SpokenLanguage[];
    onChange?: (languages: SpokenLanguage[], hasErrors: boolean) => void;
};

// Component state
export type SpokenLanguagesInputState = {
    languages: SpokenLanguage[];
    errors: (string | boolean)[];
};

// TODO move
const MAX_LANGUAGES = 5;

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "column",
        width: "100%",
        marginBottom: 8,
    },
    inputRowContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    errorRowContainer: {
        marginBottom: 8,
    },
    plusButtonWrapper: {
        alignItems: "center",
        marginTop: 10,
    },
    plusButton: {
        width: 36,
        height: 36,
        fontSize: 36,
        borderRadius: 18,
    },
    deleteIcon: {
        fontSize: 24,
    },
    inputs: {
        borderRadius: 0,
    },
    languagePicker: {
        flex: 1,
        flexGrow: 3,
    },
    levelPicker: {
        flex: 1,
        flexGrow: 2,
        marginHorizontal: 5,
    },
});

class SpokenLanguagesInput extends React.Component<SpokenLanguagesInputProps, SpokenLanguagesInputState> {
    constructor(props: SpokenLanguagesInputProps) {
        super(props);
        const languages = props.languages || [];
        this.state = {
            languages,
            errors: languages.map(() => false),
        };
    }

    componentDidMount() {
        if (this.state.languages.length == 0) this.addRow();
    }

    onChange(languages: SpokenLanguage[]) {
        const errors = this.computeErrors(languages);
        this.setState({...this.state, languages, errors});

        if (this.props.onChange) {
            const hasErrors = errors.filter((e: string | boolean) => e !== false).length > 0;
            this.props.onChange(languages, hasErrors);
        }
    }

    computeErrors(languages: SpokenLanguage[]): (string | boolean)[] {
        return languages.map((sl: SpokenLanguage) => {
            const multipleOccurrences =
                languages.filter((l: SpokenLanguage) => l.code != "" && l.code == sl.code).length > 1;
            return multipleOccurrences ? "validation.languages..multiple" : sl.code == "" || sl.level == "";
        });
    }

    addRow() {
        if (this.state.languages.length < MAX_LANGUAGES) {
            const languages = this.state.languages.concat([{code: "", level: ""}]);
            this.onChange(languages);
        }
    }

    removeRow(idx: number) {
        if (idx >= 0 && idx < this.state.languages.length) {
            const languages = this.state.languages.slice(); // copy
            languages.splice(idx, 1);
            this.onChange(languages);
        }
    }

    setLanguageCode(idx: number, code: string) {
        const languages = this.state.languages.slice(); // copy
        languages[idx].code = code;
        this.onChange(languages);
    }

    setLanguageLevel(idx: number, level: string) {
        const languages = this.state.languages.slice(); // copy
        languages[idx].level = level;
        this.onChange(languages);
    }

    render(): JSX.Element {
        const {theme} = this.props;
        const {languages} = this.state;

        const rows = languages.map((sl: SpokenLanguage, i: number) => {
            const error = this.state.errors[i];
            return (
                <View key={i} style={styles.rowContainer}>
                    <View style={styles.inputRowContainer}>
                        <LanguagePicker
                            single={true}
                            languages={[sl.code]}
                            style={styles.languagePicker}
                            pickerStyle={styles.inputs}
                            onChange={(languageCodes: string[]) => this.setLanguageCode(i, languageCodes[0])}
                        />
                        <LanguageLevelPicker
                            level={sl.level}
                            style={styles.levelPicker}
                            onChange={(level: string) => this.setLanguageLevel(i, level)}
                        ></LanguageLevelPicker>
                        <MaterialIcons
                            onPress={() => this.removeRow(i)}
                            style={[styles.deleteIcon, {color: theme.error}]}
                            name="delete"
                        />
                    </View>
                    {typeof error === "string" && (
                        <View style={styles.errorRowContainer}>
                            <InputErrorText error={error} />
                        </View>
                    )}
                </View>
            );
        });

        const canAddMore =
            this.state.languages.length < MAX_LANGUAGES &&
            this.state.languages.filter((sl: SpokenLanguage) => sl.level == "" || sl.code == "").length == 0;

        return (
            <View>
                {rows}
                <View style={styles.plusButtonWrapper}>
                    {canAddMore && (
                        <MaterialIcons
                            onPress={() => this.addRow()}
                            style={[styles.plusButton, {color: theme.background, backgroundColor: theme.accent}]}
                            name="add"
                        />
                    )}
                </View>
            </View>
        );
    }
}

export default reduxConnector(SpokenLanguagesInput);
