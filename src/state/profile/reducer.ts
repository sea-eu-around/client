import {RoleToggle} from "../../components/RoleToggle";
import {ProfileState, ProfileAction} from "../types";
import {PROFILE_ACTION_TYPES} from "./actions";

export const initialState: ProfileState = {
    userProfile: {
        firstName: "Fred",
        lastName: "Roger",
        email: "test@email.com",
        levelOfStudy: 2,
        nationality: "FR",
        role: "staff",
        gender: "M",
        birthDate: new Date(1999, 6, 2),
        hobbies: ["Acrobatics", "Acting", "Animation"],
    },
};

export const profileReducer = (state: ProfileState = initialState, action: ProfileAction): ProfileState => {
    const newState: ProfileState = {...state}; // shallow copy
    switch (action.type) {
        case PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS:
            return {...newState, userProfile: {...state.userProfile, ...action.fields}};
        default:
            return state;
    }
};
