import * as React from "react";
import {AnyAction} from "redux";
import {
    CreateProfileDto,
    CreateProfileDtoCommon,
    CreateProfileDtoStaff,
    CreateProfileDtoStudent,
    initOfferValue,
    OfferCategory,
    OfferDto,
    OfferValueDto,
} from "../../api/dto";
import OfferControl from "../../components/OfferControl";
import {setOnboardingOfferValue} from "../../state/auth/actions";
import {createProfile} from "../../state/profile/actions";
import store from "../../state/store";
import {MyThunkDispatch, OnboardingState} from "../../state/types";
import {onboardingOffersStyle} from "../../styles/onboarding";
import {Theme} from "../../types";
import i18n from "i18n-js";
import {Text} from "react-native";

export function createOfferControls(
    offers: OfferDto[],
    category: OfferCategory,
    onboardingState: OnboardingState,
    dispatch: React.Dispatch<AnyAction>,
    theme: Theme,
): JSX.Element {
    const styles = onboardingOffersStyle(theme);
    return (
        <>
            <Text style={styles.offerControlPreText}>{i18n.t("offersPreText")}</Text>
            {offers
                .filter((offer: OfferDto) => offer.category == category)
                .map((offer: OfferDto, i: number) => (
                    <OfferControl
                        key={i}
                        offer={offer}
                        value={onboardingState.offerValues[offer.id] || initOfferValue(offer)}
                        onChange={(value: OfferValueDto) => dispatch(setOnboardingOfferValue(offer.id, value))}
                        style={styles.offerControl}
                    />
                ))}
        </>
    );
}

function onboardingStateToDto(onboardingState: OnboardingState): CreateProfileDto | null {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */

    const base: CreateProfileDtoCommon = {
        type: onboardingState.type!,
        firstName: onboardingState.firstname!,
        lastName: onboardingState.lastname!,
        gender: onboardingState.gender!,
        birthdate: onboardingState.birthdate!.toJSON(),
        nationality: onboardingState.nationality!,
        languages: onboardingState.languages,
        interests: onboardingState.interestIds.map((id) => ({id})),
        profileOffers: Object.values(onboardingState.offerValues),
        educationFields: onboardingState.educationFields.map((id) => ({id})),
    };

    if (onboardingState.type == "student") {
        return {
            ...base,
            degree: onboardingState.degree,
        } as CreateProfileDtoStudent;
    } else if (onboardingState.type == "staff") {
        return {
            ...base,
            staffRoles: Object.keys(onboardingState.staffRoles)
                .filter((k) => onboardingState.staffRoles[k])
                .map((id: string) => ({id})),
        } as CreateProfileDtoStaff;
    }
    return null;
}

export function finishOnboarding(onboardingState: OnboardingState): void {
    const createProfileDto = onboardingStateToDto(onboardingState);
    if (createProfileDto) (store.dispatch as MyThunkDispatch)(createProfile(createProfileDto));
}
