import {stripSuperfluousOffers} from "../../api/converters";
import {OfferCategory, OfferDto} from "../../api/dto";
import {AuthAction, AUTH_ACTION_TYPES, LogInSuccessAction} from "../auth/actions";
import {ProfileState} from "../types";
import {
    CreateProfileSuccessAction,
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
    uploadingAvatar: false,
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
                const {fields} = action as SetProfileFieldsSuccessAction;
                if (fields.profileOffers) fields.profileOffers = stripSuperfluousOffers(fields.profileOffers);
                return {
                    ...state,
                    user: {...state.user, profile: state.user.profile ? {...state.user.profile, ...fields} : undefined},
                };
            } else return {...state};
        }
        case PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS: {
            const {profile} = action as CreateProfileSuccessAction;
            return state.user ? {...state, user: {...state.user, profile}} : state;
        }
        case PROFILE_ACTION_TYPES.LOAD_PROFILE_OFFERS_SUCCESS: {
            let {offers} = action as LoadProfileOffersSuccessAction;

            // Reorder the offers

            // "Collaborate" category
            const collab = offers
                .filter((o) => o.category === OfferCategory.Collaborate)
                .sort((a, b) => (a.id < b.id ? -1 : 1));
            // "Discover" category
            const disco = offers
                .filter((o) => o.category === OfferCategory.Discover)
                .sort((a, b) => (a.id < b.id ? 1 : -1));
            // "Meet " category
            const meet = offers.filter((o) => o.category === OfferCategory.Meet).sort((a, b) => (a.id < b.id ? -1 : 1));

            offers = collab.concat(disco).concat(meet);

            const offerIdToCategory = new Map(offers.map((o: OfferDto) => [o.id, o.category]));
            return {...state, offers, offerIdToCategory};
        }
        case PROFILE_ACTION_TYPES.LOAD_PROFILE_INTERESTS_SUCCESS: {
            const {interests} = action as LoadProfileInterestsSuccessAction;
            // Sort alphabetically
            interests.sort((a, b) => (a.id > b.id ? 1 : -1));
            return {...state, interests};
        }
        case PROFILE_ACTION_TYPES.FETCH_USER_SUCCESS: {
            const {user} = action as FetchUserSuccessAction;
            return {...state, user};
        }
        case PROFILE_ACTION_TYPES.SET_AVATAR_BEGIN: {
            return {...state, uploadingAvatar: true};
        }
        case PROFILE_ACTION_TYPES.SET_AVATAR_FAILURE: {
            return {...state, uploadingAvatar: false};
        }
        case PROFILE_ACTION_TYPES.SET_AVATAR_SUCCESS: {
            const {avatarUrl} = action as SetAvatarSuccessAction;
            if (state.user === null) return {...state};
            else {
                return {
                    ...state,
                    user: {...state.user, profile: state.user.profile ? {...state.user.profile, avatarUrl} : undefined},
                    uploadingAvatar: false,
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
