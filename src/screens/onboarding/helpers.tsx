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

export function createOfferControls(
    offers: OfferDto[],
    category: OfferCategory,
    onboardingState: OnboardingState,
    dispatch: React.Dispatch<AnyAction>,
): JSX.Element[] {
    return offers
        .filter((offer: OfferDto) => offer.category == category)
        .map((offer: OfferDto, i: number) => (
            <OfferControl
                key={i}
                offer={offer}
                value={onboardingState.offerValues[offer.id] || initOfferValue(offer)}
                onChange={(value: OfferValueDto) => dispatch(setOnboardingOfferValue(offer.id, value))}
                style={{marginVertical: 20}}
            />
        ));
}

function onboardingStateToDto(onboardingState: OnboardingState): CreateProfileDto | null {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */

    const base: CreateProfileDtoCommon = {
        type: onboardingState.role!,
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

    if (onboardingState.role == "student") {
        return {
            ...base,
            degree: onboardingState.degree,
        } as CreateProfileDtoStudent;
    } else if (onboardingState.role == "staff") {
        return {
            ...base,
            staffRole: onboardingState.staffRole,
        } as CreateProfileDtoStaff;
    }
    return null;
}

export function finishOnboarding(onboardingState: OnboardingState): void {
    const createProfileDto = onboardingStateToDto(onboardingState);
    if (createProfileDto) (store.dispatch as MyThunkDispatch)(createProfile(createProfileDto));
}
