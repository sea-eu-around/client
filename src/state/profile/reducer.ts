import {UserProfileDto} from "../../api/dto";
import {
    ProfileState,
    ProfileAction,
    SetProfileFieldsAction,
    PROFILE_ACTION_TYPES,
    LoadProfileOffersSuccessAction,
    LoadProfileInterestsSuccessAction,
    FetchProfilesSuccessAction,
} from "../types";

export const initialState: ProfileState = {
    user: {
        email: "fred.roger@univ-brest.fr",
        onboarded: false,
        role: "student",
        active: true,
        verificationToken: "",
        profile: {
            id: "fr1FgS3qfqGfqdkiumpi8LP5qfS9Af0Bqf1Jzaf8Ofq",
            firstName: "Fred",
            lastName: "Roger",
            university: "univ-brest",
            degree: "phd",
            nationality: "FR",
            gender: "male",
            birthdate: new Date(1999, 6, 2),
            interests: ["netflix"],
            languages: [],
            avatarUri: "",
            educationFields: ["field-06", "field-07"],
        } as UserProfileDto,
    },
    offers: [],
    interests: [],
    fetchedProfiles: [],
    fetchingProfiles: false,
    fetchingPage: 1,
};

export const profileReducer = (state: ProfileState = initialState, action: ProfileAction): ProfileState => {
    switch (action.type) {
        case PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS: {
            const {fields} = <SetProfileFieldsAction>action;
            return {...state, user: {...state.user, profile: {...state.user.profile, ...fields}}};
        }
        case PROFILE_ACTION_TYPES.LOAD_PROFILE_OFFERS_SUCCESS: {
            const {offers} = <LoadProfileOffersSuccessAction>action;
            return {...state, offers};
        }
        case PROFILE_ACTION_TYPES.LOAD_PROFILE_INTERESTS_SUCCESS: {
            const {interests} = <LoadProfileInterestsSuccessAction>action;
            // Sort alphabetically
            interests.sort((a, b) => (a.id > b.id ? 1 : -1));
            return {...state, interests};
        }
        case PROFILE_ACTION_TYPES.FETCH_PROFILES_BEGIN: {
            return {...state, fetchingProfiles: true};
        }
        case PROFILE_ACTION_TYPES.FETCH_PROFILES_FAILURE: {
            return {...state, fetchingProfiles: false};
        }
        case PROFILE_ACTION_TYPES.FETCH_PROFILES_SUCCESS: {
            const {profiles} = <FetchProfilesSuccessAction>action;
            return {
                ...state,
                fetchedProfiles: state.fetchedProfiles.concat(profiles),
                fetchingProfiles: false,
                fetchingPage: state.fetchingPage + 1,
            };
        }
        case PROFILE_ACTION_TYPES.FETCH_PROFILES_REFRESH: {
            return {
                ...state,
                fetchedProfiles: [],
                fetchingProfiles: false,
                fetchingPage: 1,
            };
        }
        default:
            return state;
    }
};
