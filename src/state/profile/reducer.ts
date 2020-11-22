import {OfferDto} from "../../api/dto";
import {
    ProfileState,
    ProfileAction,
    PROFILE_ACTION_TYPES,
    LoadProfileOffersSuccessAction,
    LoadProfileInterestsSuccessAction,
    SetProfileFieldsSuccessAction,
    FetchUserSuccessAction,
    SetAvatarSuccessAction,
} from "../types";

export const initialState: ProfileState = {
    user: null,
    offers: [],
    offerIdToCategory: new Map(),
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
            const offerIdToCategory = new Map(offers.map((o: OfferDto) => [o.id, o.category]));
            return {...state, offers, offerIdToCategory};
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
        case PROFILE_ACTION_TYPES.SET_AVATAR_SUCCESS: {
            const {avatarUrl} = <SetAvatarSuccessAction>action;
            if (state.user === null) return {...state};
            else return {...state, user: {...state.user, profile: {...state.user.profile, avatarUrl}}};
        }
        default:
            return state;
    }
};
