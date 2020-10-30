import {
    ProfileState,
    ProfileAction,
    AuthAction,
    SetProfileFieldsAction,
    PROFILE_ACTION_TYPES,
    LoadProfileOffersSuccessAction,
    LoadProfileInterestsSuccessAction,
} from "../types";

export const initialState: ProfileState = {
    userProfile: {
        firstName: "Fred",
        lastName: "Roger",
        email: "fred.roger@univ-brest.fr",
        university: "univ-brest",
        levelOfStudy: 2,
        nationality: "FR",
        role: "staff",
        gender: "MALE",
        birthDate: new Date(1999, 6, 2),
        interests: ["netflix"],
        languages: [],
        avatarUri: "",
    },
    offers: [],
    interests: [],
};

export const profileReducer = (
    state: ProfileState = initialState,
    action: ProfileAction | AuthAction,
): ProfileState => {
    const newState: ProfileState = {...state}; // shallow copy
    switch (action.type) {
        case PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS: {
            const {fields} = <SetProfileFieldsAction>action;
            return {...newState, userProfile: {...state.userProfile, ...fields}};
        }
        case PROFILE_ACTION_TYPES.LOAD_PROFILE_OFFERS_SUCCESS: {
            const {offers} = <LoadProfileOffersSuccessAction>action;
            return {...newState, offers};
        }
        case PROFILE_ACTION_TYPES.LOAD_PROFILE_INTERESTS_SUCCESS: {
            const {interests} = <LoadProfileInterestsSuccessAction>action;
            return {...newState, interests};
        }
        default:
            return state;
    }
};
