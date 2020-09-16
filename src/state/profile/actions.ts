import {SetProfileFieldsAction} from "../types";
import {FullProfile} from "../../model/profile";

export enum PROFILE_ACTION_TYPES {
    PROFILE_SET_FIELDS = "PROFILE/SET_FIELDS",
}

export const setProfileFields = (fields: Partial<FullProfile>): SetProfileFieldsAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS,
    fields,
});

// Example asynchronous action creator (redux-thunk)
/*export const login = (username: string, password: string): AppThunk => async (dispatch) => {
    const resp = await loginAPI()
    dispatch(
        loginSuccess({token})
    )
};
*/
