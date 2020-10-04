import * as React from "react";

import {Text, TextProps} from "react-native";
import i18n from "i18n-js";

export type FormattedDateProps = {
    date: Date;
} & TextProps;

export function FormattedDate(props: FormattedDateProps): JSX.Element {
    const {date, ...otherProps} = props;

    const localizedMonth = i18n.t(`months.${date.getMonth()}`);
    const paddedDay = ((date.getDate() + "").length == 1 ? "0" : "") + date.getDate();
    const formattedDate = `${paddedDay} ${localizedMonth} ${date.getFullYear()}`;

    return <Text {...otherProps}>{formattedDate}</Text>;
}
