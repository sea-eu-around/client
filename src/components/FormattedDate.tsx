import * as React from "react";

import {Text, TextProps} from "react-native";
import i18n from "i18n-js";

// Component props
export type FormattedDateProps = {
    date?: Date;
} & TextProps;

export function FormattedDate(props: FormattedDateProps): JSX.Element {
    const {date, ...otherProps} = props;

    if (date) {
        const localizedMonth = i18n.t(`months.${date.getMonth()}`);
        //const day = ((date.getDate() + "").length == 1 ? "0" : "") + date.getDate();
        const day = date.getDate() + "";
        const formattedDate = `${day} ${localizedMonth} ${date.getFullYear()}`;

        return <Text {...otherProps}>{formattedDate}</Text>;
    } else return <></>;
}
