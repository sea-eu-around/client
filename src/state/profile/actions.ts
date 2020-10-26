import {AppThunk, SetProfileFieldsAction, CreateProfileSuccessAction, PROFILE_ACTION_TYPES} from "../types";
import {FullProfile} from "../../model/profile";
import {BACKEND_URL} from "../../constants/config";
import {CreateProfileDto} from "../../api/dto";
import {Role} from "../../constants/profile-constants";
import store from "../store";
import {requestBackend} from "../../api/utils";

export const setProfileFields = (fields: Partial<FullProfile>): SetProfileFieldsAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS,
    fields,
});

export const createProfileSuccess = (): CreateProfileSuccessAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS,
});

export const createProfile = (role: Role, profile: CreateProfileDto): AppThunk => async (dispatch) => {
    const type = role == "student" ? "STUDENT" : "STAFF";
    const response = await requestBackend("profiles", "POST", {type}, profile, true);
    if (response.success) {
        dispatch(createProfileSuccess());
    }
    /* else {
        
    }*/
};
