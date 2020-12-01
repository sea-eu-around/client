import {stripSuperfluousOffers} from "../../api/converters";
import {OfferDto} from "../../api/dto";
import {AuthAction, AUTH_ACTION_TYPES, LogInSuccessAction} from "../auth/actions";
import {ProfileState} from "../types";
import {
    FetchUserSuccessAction,
    LoadProfileInterestsSuccessAction,
    LoadProfileOffersSuccessAction,
    ProfileAction,
    PROFILE_ACTION_TYPES,
    SetAvatarSuccessAction,
    SetProfileFieldsSuccessAction,
} from "./actions";

export const initialState: ProfileState = {
    user: null,
    offers: [],
    offerIdToCategory: new Map(),
    interests: [],
};

export const profileReducer = (
    state: ProfileState = initialState,
    action: ProfileAction | AuthAction,
): ProfileState => {
    switch (action.type) {
        case AUTH_ACTION_TYPES.LOG_IN_SUCCESS: {
            const {user} = action as LogInSuccessAction;
            return {...state, user};
        }
        case PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS_SUCCESS: {
            if (state.user) {
                const {fields} = <SetProfileFieldsSuccessAction>action;
                if (fields.profileOffers) fields.profileOffers = stripSuperfluousOffers(fields.profileOffers);
                return {
                    ...state,
                    user: {...state.user, profile: state.user.profile ? {...state.user.profile, ...fields} : undefined},
                };
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
            else {
                return {
                    ...state,
                    user: {...state.user, profile: state.user.profile ? {...state.user.profile, avatarUrl} : undefined},
                };
            }
        }
        case AUTH_ACTION_TYPES.LOG_OUT: {
            return {...state, user: null};
        }
        default:
            return state;
    }
};
