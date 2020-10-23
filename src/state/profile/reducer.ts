import {ProfileState, ProfileAction, AuthAction, SetProfileFieldsAction, PROFILE_ACTION_TYPES} from "../types";

export const initialState: ProfileState = {
    userProfile: {
        firstName: "Fred",
        lastName: "Roger",
        email: "fred.roger@univ-brest.fr",
        levelOfStudy: 2,
        nationality: "FR",
        role: "staff",
        gender: "MALE",
        birthDate: new Date(1999, 6, 2),
        hobbies: ["Acrobatics", "Acting", "Animation"],
        avatarUri: "",
    },
};

export const profileReducer = (
    state: ProfileState = initialState,
    action: ProfileAction | AuthAction,
): ProfileState => {
    const newState: ProfileState = {...state}; // shallow copy
    switch (action.type) {
        case PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS:
            const {fields} = <SetProfileFieldsAction>action;
            return {...newState, userProfile: {...state.userProfile, ...fields}};
        default:
            return state;
    }
};
