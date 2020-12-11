import * as React from "react";
import {View, StyleSheet, ViewStyle, Text, Alert} from "react-native";
import LanguagePicker from "./LanguagePicker";
import LanguageLevelPicker from "./LanguageLevelPicker";
import {MaterialIcons} from "@expo/vector-icons";
import {LanguageLevel} from "../constants/profile-constants";
import {Theme, ThemeProps} from "../types";
import {preTheme} from "../styles/utils";
import {withTheme} from "react-native-elements";
import {SpokenLanguageDto} from "../api/dto";
import {MAX_SPOKEN_LANGUAGES} from "../constants/config";
import i18n from "i18n-js";

// Component props
export type SpokenLanguagesInputProps = ThemeProps & {
    languages: SpokenLanguageDto[];
    onChange?: (languages: SpokenLanguageDto[], hasErrors: boolean) => void;
    style?: ViewStyle;
};

// Component state
export type SpokenLanguagesInputState = {
    languages: Partial<SpokenLanguageDto>[];
};

class SpokenLanguagesInput extends React.Component<SpokenLanguagesInputProps, SpokenLanguagesInputState> {
    constructor(props: SpokenLanguagesInputProps) {
        super(props);
        const languages = props.languages || [];
        this.state = {languages};
    }

    onChange(languages: Partial<SpokenLanguageDto>[]) {
        this.setState({...this.state, languages});
        const hasErrors = languages.filter((l) => !l.level).length > 0;

        if (this.props.onChange) {
            this.props.onChange(
                languages
                    .filter((l: Partial<SpokenLanguageDto>) => l.code && l.level)
                    .map((l: Partial<SpokenLanguageDto>) => l as SpokenLanguageDto),
                hasErrors,
            );
        }
    }

    removeRow(idx: number) {
        if (idx >= 0 && idx < this.state.languages.length)
            this.onChange(this.state.languages.filter((v, i) => i !== idx));
    }

    setLanguages(codes: string[]) {
        const levelDict = new Map(this.state.languages.map((l) => [l.code, l.level]));
        const languages = codes.map((code: string) => ({code, level: levelDict.get(code)}));
        this.onChange(languages);

        this.setState({
            ...this.state,
            languages,
        });
    }

    setLanguageLevel(idx: number, level: LanguageLevel) {
        const languages = this.state.languages.map((l, i) => (i === idx ? {...l, level} : l));
        this.onChange(languages);
    }

    render(): JSX.Element {
        const {theme, style} = this.props;
        const {languages} = this.state;
        const styles = themedStyles(theme);

        const rows = languages.map((sl: Partial<SpokenLanguageDto>, i: number) => {
            return (
                <View key={`spoken-languages-input-${sl.code}`} style={styles.rowContainer}>
                    <Text style={styles.languageLabel}>{i18n.t(`languageNames.${sl.code}`)}</Text>
                    <LanguageLevelPicker
                        level={sl.level}
                        buttonStyle={styles.levelPicker}
                        onChange={(level: LanguageLevel) => this.setLanguageLevel(i, level)}
                    />
                    <MaterialIcons onPress={() => this.removeRow(i)} style={styles.deleteIcon} name="delete" />
                </View>
            );
        });

        return (
            <View style={style}>
                <LanguagePicker
                    multiple={true}
                    languages={languages.map((l) => l.code || "")}
                    style={styles.languagePicker}
                    onChange={(languageCodes: string[]) => {
                        if (languageCodes.length > MAX_SPOKEN_LANGUAGES)
                            Alert.alert(`You cannot select more than ${MAX_SPOKEN_LANGUAGES} languages`);
                        this.setLanguages(languageCodes.slice(0, MAX_SPOKEN_LANGUAGES));
                    }}
                    showChips={false}
                />
                {rows}
            </View>
        );
    }
}

const themedStyles = preTheme((theme: Theme) => {
    return StyleSheet.create({
        rowContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        deleteIcon: {
            fontSize: 24,
            color: theme.error,
            paddingHorizontal: 4,
            height: "100%",
            textAlignVertical: "center",
        },
        languagePicker: {},
        languageLabel: {
            fontSize: 16,
            color: theme.text,
            flexGrow: 1,
        },
        levelPicker: {
            marginHorizontal: 5,
        },
    });
});

export default withTheme(SpokenLanguagesInput);
