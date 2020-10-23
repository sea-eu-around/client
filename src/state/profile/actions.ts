import {AppThunk, SetProfileFieldsAction, CreateProfileSuccessAction, PROFILE_ACTION_TYPES} from "../types";
import {FullProfile} from "../../model/profile";
import {BACKEND_URL} from "../../constants/config";
import {CreateProfileDto} from "../../api/dto";
import {Role} from "../../constants/profile-constants";
import store from "../store";

export const setProfileFields = (fields: Partial<FullProfile>): SetProfileFieldsAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS,
    fields,
});

export const createProfileSuccess = (): CreateProfileSuccessAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS,
});

export const createProfile = (role: Role, profile: CreateProfileDto): AppThunk => async (dispatch) => {
    const type = role == "student" ? "STUDENT" : "STAFF";
    const token = store.getState().auth.token;

    if (token !== null) {
        try {
            console.log(JSON.stringify(profile));
            const response = await fetch(`${BACKEND_URL}/profiles?type=${type}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token.accessToken}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profile),
            });

            const json = await response.json();
            console.log("Response : ");
            console.log(json);

            if (json.success) {
                dispatch(createProfileSuccess());
            }
            /* else {
                
            }*/
        } catch (error) {
            console.error(error);
            //dispatch(validateAccountFailure([]));
        }
    }
};
