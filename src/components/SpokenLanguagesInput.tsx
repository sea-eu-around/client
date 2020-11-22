import * as React from "react";
import {View, StyleSheet, ViewStyle} from "react-native";
import LanguagePicker from "./LanguagePicker";
import LanguageLevelPicker from "./LanguageLevelPicker";
import InputErrorText from "./InputErrorText";
import {MaterialIcons} from "@expo/vector-icons";
import {LanguageLevel} from "../constants/profile-constants";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {SpokenLanguageDto} from "../api/dto";
import {MAX_SPOKEN_LANGUAGES} from "../constants/config";

// Component props
export type SpokenLanguagesInputProps = ThemeProps & {
    languages: SpokenLanguageDto[];
    onChange?: (languages: SpokenLanguageDto[], hasErrors: boolean) => void;
    style?: ViewStyle;
};

// Component state
export type SpokenLanguagesInputState = {
    languages: Partial<SpokenLanguageDto>[];
    errors: (string | boolean)[];
};

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

    onChange(languages: Partial<SpokenLanguageDto>[]) {
        const errors = this.computeErrors(languages);
        this.setState({...this.state, languages, errors});

        if (this.props.onChange) {
            const hasErrors = errors.filter((e: string | boolean) => e !== false).length > 0;
            this.props.onChange(
                languages
                    .filter((l: Partial<SpokenLanguageDto>) => l.code && l.level)
                    .map((l: Partial<SpokenLanguageDto>) => l as SpokenLanguageDto),
                hasErrors,
            );
        }
    }

    computeErrors(languages: Partial<SpokenLanguageDto>[]): (string | boolean)[] {
        return languages.map((sl: Partial<SpokenLanguageDto>) => {
            const multipleOccurrences =
                languages.filter((l: Partial<SpokenLanguageDto>) => l.code && l.code == sl.code).length > 1;
            return multipleOccurrences ? "validation.languages.multiple" : !sl.code || !sl.level;
        });
    }

    addRow() {
        if (this.state.languages.length < MAX_SPOKEN_LANGUAGES) {
            const languages = this.state.languages.concat([{code: ""}]);
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

    setLanguageLevel(idx: number, level: LanguageLevel) {
        const languages = this.state.languages.slice(); // copy
        languages[idx].level = level;
        this.onChange(languages);
    }

    render(): JSX.Element {
        const {theme, style} = this.props;
        const {languages} = this.state;
        const styles = themedStyles(theme);

        const rows = languages.map((sl: Partial<SpokenLanguageDto>, i: number) => {
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
                            onChange={(level: LanguageLevel) => this.setLanguageLevel(i, level)}
                        ></LanguageLevelPicker>
                        <MaterialIcons onPress={() => this.removeRow(i)} style={styles.deleteIcon} name="delete" />
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
            this.state.languages.length < MAX_SPOKEN_LANGUAGES &&
            this.state.languages.filter((sl: Partial<SpokenLanguageDto>) => !sl.level || !sl.code).length == 0;

        return (
            <View style={style}>
                {rows}
                <View style={styles.plusButtonWrapper}>
                    {canAddMore && <MaterialIcons onPress={() => this.addRow()} style={styles.plusButton} name="add" />}
                </View>
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
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
            color: theme.background,
            backgroundColor: theme.accent,
        },
        deleteIcon: {
            fontSize: 24,
            color: theme.error,
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
});

export default withTheme(SpokenLanguagesInput);
