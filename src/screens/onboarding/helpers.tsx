import * as React from "react";
import {AnyAction} from "redux";
import {
    CreateProfileDto,
    CreateProfileDtoCommon,
    CreateProfileDtoStaff,
    CreateProfileDtoStudent,
    OfferCategory,
    OfferDto,
    OfferValueDto,
} from "../../api/dto";
import OfferControl from "../../components/OfferControl";
import {LEVELS_OF_STUDY} from "../../constants/profile-constants";
import {setOnboardingOfferValue} from "../../state/auth/actions";
import {OnboardingState} from "../../state/types";

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
                value={onboardingState.offerValues[offer.id] || {roles: [], genders: []}}
                onChange={(value: Partial<OfferValueDto>) => dispatch(setOnboardingOfferValue(offer.id, value))}
                style={{marginVertical: 20}}
            />
        ));
}

export function onboardingStateToDto(onboardingState: OnboardingState): CreateProfileDto | null {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */

    const base: CreateProfileDtoCommon = {
        firstName: onboardingState.firstname!,
        lastName: onboardingState.lastname!,
        gender: onboardingState.gender!,
        birthdate: onboardingState.birthDate!.toJSON(),
        nationality: onboardingState.nationality!,
        languages: onboardingState.languages,
    };

    if (onboardingState.role == "student") {
        return {
            ...base,
            degree: LEVELS_OF_STUDY[onboardingState.levelOfStudy],
        } as CreateProfileDtoStudent;
    } else if (onboardingState.role == "staff") {
        return {
            ...base,
            staffRole: onboardingState.staffRole,
        } as CreateProfileDtoStaff;
    }
    return null;
}
