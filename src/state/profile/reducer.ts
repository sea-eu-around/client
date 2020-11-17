import {
    ProfileState,
    ProfileAction,
    PROFILE_ACTION_TYPES,
    LoadProfileOffersSuccessAction,
    LoadProfileInterestsSuccessAction,
    SetProfileFieldsSuccessAction,
    FetchUserSuccessAction,
} from "../types";

export const initialState: ProfileState = {
    user: null,
    offers: [],
    interests: [],
};

export const profileReducer = (state: ProfileState = initialState, action: ProfileAction): ProfileState => {
    switch (action.type) {
        case PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS_SUCCESS: {
            if (state.user) {
                const {fields} = <SetProfileFieldsSuccessAction>action;
                return {...state, user: {...state.user, profile: {...state.user.profile, ...fields}}};
            } else return {...state};
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
        case PROFILE_ACTION_TYPES.FETCH_USER_SUCCESS: {
            const {user} = <FetchUserSuccessAction>action;
            return {...state, user};
        }
        default:
            return state;
    }
};
