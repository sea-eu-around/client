import {AppThunk} from "../types";
import {
    AvatarSuccessfulUpdatedDto,
    CreateProfileDto,
    InterestDto,
    OfferDto,
    RequestResponse,
    ResponseProfileDto,
    ResponseUserDto,
    SignedUrlResponseDto,
    SuccessfulRequestResponse,
    ResponseProfileWithMatchInfoDto,
} from "../../api/dto";
import {UserProfile, UserProfileWithMatchInfo} from "../../model/user-profile";
import {User} from "../../model/user";
import {requestBackend} from "../../api/utils";
import {
    convertDtoToProfile,
    convertDtoToProfileWithMatchInfo,
    convertDtoToUser,
    convertPartialProfileToCreateDto,
} from "../../api/converters";
import {ImageInfo} from "expo-image-picker/build/ImagePicker.types";
import {HttpStatusCode} from "../../constants/http-status";
import {readCachedStaticData} from "../persistent-storage/static";

export enum PROFILE_ACTION_TYPES {
    LOAD_USER_PROFILE = "PROFILE/LOAD_USER_PROFILE",
    LOAD_PROFILE_OFFERS = "LOAD_PROFILE_OFFERS",
    LOAD_PROFILE_OFFERS_SUCCESS = "LOAD_PROFILE_OFFERS_SUCCESS",
    LOAD_PROFILE_INTERESTS = "LOAD_PROFILE_INTERESTS",
    LOAD_PROFILE_INTERESTS_SUCCESS = "LOAD_PROFILE_INTERESTS_SUCCESS",
    PROFILE_SET_FIELDS_SUCCESS = "PROFILE/SET_FIELDS_SUCCESS",
    PROFILE_SET_FIELDS_FAILURE = "PROFILE/SET_FIELDS_FAILURE",
    PROFILE_CREATE = "PROFILE/CREATE",
    PROFILE_CREATE_SUCCESS = "PROFILE/CREATE_SUCCESS",
    FETCH_USER_SUCCESS = "PROFILE/FETCH_USER_SUCCESS",
    FETCH_PROFILE_SUCCESS = "PROFILE/FETCH_PROFILE_SUCCESS",
    SET_AVATAR = "PROFILE/SET_AVATAR",
    SET_AVATAR_BEGIN = "PROFILE/SET_AVATAR_BEGIN",
    SET_AVATAR_SUCCESS = "PROFILE/SET_AVATAR_SUCCESS",
    SET_AVATAR_FAILURE = "PROFILE/SET_AVATAR_FAILURE",
}

export type LoadUserProfileAction = {
    type: string;
    id: string;
};

export type SetProfileFieldsAction = {
    type: string;
    fields: Partial<UserProfile>;
};

export type SetProfileFieldsFailureAction = {
    type: string;
};

export type SetProfileFieldsSuccessAction = {
    type: string;
    fields: Partial<UserProfile>;
};

export type CreateProfileAction = {
    type: string;
    profile: CreateProfileDto;
};

export type CreateProfileSuccessAction = {
    type: string;
    profile: UserProfile;
};

export type LoadProfileOffersAction = {
    type: string;
};

export type LoadProfileOffersSuccessAction = {
    type: string;
    offers: OfferDto[];
    fromCache: boolean;
};

export type LoadProfileInterestsAction = {
    type: string;
};

export type LoadProfileInterestsSuccessAction = {
    type: string;
    interests: InterestDto[];
    fromCache: boolean;
};

export type FetchUserSuccessAction = {
    type: string;
    user: User;
};

export type FetchProfileSuccessAction = {
    type: string;
    profile: UserProfileWithMatchInfo;
};

export type SetAvatarBeginAction = {
    type: string;
};

export type SetAvatarSuccessAction = {
    type: string;
    avatarUrl: string;
};

export type SetAvatarFailureAction = {
    type: string;
};

export type ProfileAction =
    | SetProfileFieldsAction
    | SetProfileFieldsFailureAction
    | SetProfileFieldsSuccessAction
    | CreateProfileAction
    | CreateProfileSuccessAction
    | LoadProfileOffersAction
    | LoadProfileOffersSuccessAction
    | LoadProfileInterestsAction
    | LoadProfileInterestsSuccessAction
    | FetchUserSuccessAction
    | FetchProfileSuccessAction
    | SetAvatarBeginAction
    | SetAvatarSuccessAction
    | SetAvatarFailureAction;

const setProfileFieldsSuccess = (fields: Partial<UserProfile>): SetProfileFieldsSuccessAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS_SUCCESS,
    fields,
});

const setProfileFieldsFailure = (): SetProfileFieldsFailureAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS_FAILURE,
});

export const setProfileFields = (fields: Partial<UserProfile>): AppThunk => async (dispatch, getState) => {
    const token = getState().auth.token;
    const type = getState().profile.user?.profile?.type;

    const dto: Partial<CreateProfileDto> = convertPartialProfileToCreateDto(fields, type);
    const response = await requestBackend("profiles", "PATCH", {}, dto, token);
    if (response.status === HttpStatusCode.OK) dispatch(setProfileFieldsSuccess(fields));
    else dispatch(setProfileFieldsFailure());
};

const createProfileSuccess = (profile: UserProfile): CreateProfileSuccessAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS,
    profile,
});

export const createProfile = (profile: CreateProfileDto): AppThunk => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await requestBackend("profiles", "POST", {}, profile, token);
    if (response.status === HttpStatusCode.CREATED) {
        const payload = (response as SuccessfulRequestResponse).data;
        const profile = convertDtoToProfile(payload as ResponseProfileDto);
        dispatch(createProfileSuccess(profile));
    }
};

export const loadProfileOffers = (): AppThunk => async (dispatch) => {
    const fromCache = await readCachedStaticData<OfferDto[]>("offers");
    const params = fromCache ? {updatedAt: fromCache.updatedAt} : {};

    requestBackend("offers", "GET", params).then((response: RequestResponse) => {
        if (response.status === HttpStatusCode.OK) {
            const payload = (response as SuccessfulRequestResponse).data;
            const offers = payload as OfferDto[];
            if (fromCache) {
                const cacheIsGood = offers.length == 0;
                dispatch(loadProfileOffersSuccess(cacheIsGood ? fromCache.data : offers, cacheIsGood));
            } else dispatch(loadProfileOffersSuccess(offers));
        }
    });
};

const loadProfileOffersSuccess = (offers: OfferDto[], fromCache = false): LoadProfileOffersSuccessAction => ({
    type: PROFILE_ACTION_TYPES.LOAD_PROFILE_OFFERS_SUCCESS,
    offers,
    fromCache,
});

export const loadProfileInterests = (): AppThunk => async (dispatch) => {
    const fromCache = await readCachedStaticData<InterestDto[]>("interests");
    const params = fromCache ? {updatedAt: fromCache.updatedAt} : {};

    requestBackend("interests", "GET", params).then((response: RequestResponse) => {
        if (response.status === HttpStatusCode.OK) {
            const payload = (response as SuccessfulRequestResponse).data;
            const interests = payload as InterestDto[];
            if (fromCache) {
                const cacheIsGood = interests.length == 0;
                dispatch(loadProfileInterestsSuccess(cacheIsGood ? fromCache.data : interests, cacheIsGood));
            } else dispatch(loadProfileInterestsSuccess(interests));
        }
    });
};

const loadProfileInterestsSuccess = (
    interests: InterestDto[],
    fromCache = false,
): LoadProfileInterestsSuccessAction => ({
    type: PROFILE_ACTION_TYPES.LOAD_PROFILE_INTERESTS_SUCCESS,
    interests,
    fromCache,
});

export const fetchUser = (): AppThunk => async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await requestBackend("auth/me", "GET", {}, {}, token);
    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data;
        const user = convertDtoToUser(payload as ResponseUserDto);
        dispatch(fetchUserSuccess(user));
    }
};

const fetchUserSuccess = (user: User): FetchUserSuccessAction => ({
    type: PROFILE_ACTION_TYPES.FETCH_USER_SUCCESS,
    user,
});

export const fetchProfile = (id: string): AppThunk<Promise<UserProfileWithMatchInfo | null>> => async (
    dispatch,
    getState,
) => {
    const token = getState().auth.token;
    const response = await requestBackend(`profiles/${id}`, "GET", {}, {}, token, true);
    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data as ResponseProfileWithMatchInfoDto;
        const profileWithMatchInfo = convertDtoToProfileWithMatchInfo(payload);
        dispatch(fetchProfileSuccess(profileWithMatchInfo));
        return profileWithMatchInfo;
    }
    return null;
};

const fetchProfileSuccess = (profile: UserProfileWithMatchInfo): FetchProfileSuccessAction => ({
    type: PROFILE_ACTION_TYPES.FETCH_PROFILE_SUCCESS,
    profile,
});

const setAvatarBegin = (): SetAvatarBeginAction => ({
    type: PROFILE_ACTION_TYPES.SET_AVATAR_BEGIN,
});

const setAvatarSuccess = (avatarUrl: string): SetAvatarSuccessAction => ({
    type: PROFILE_ACTION_TYPES.SET_AVATAR_SUCCESS,
    avatarUrl,
});

const setAvatarFailure = (): SetAvatarFailureAction => ({
    type: PROFILE_ACTION_TYPES.SET_AVATAR_FAILURE,
});

export const setAvatar = (image: ImageInfo): AppThunk => async (dispatch, getState) => {
    const {
        auth: {token},
        profile: {uploadingAvatar},
    } = getState();
    const fail = () => dispatch(setAvatarFailure());

    if (!token || uploadingAvatar) {
        fail();
        return;
    }

    dispatch(setAvatarBegin());

    const response = await requestBackend("common/signedUrl", "GET", {mimeType: "image/jpeg"}, {}, token);

    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data;
        const {fileName, s3Url} = payload as SignedUrlResponseDto;

        try {
            // Fetch the image from the device and convert it to a blob
            const imageBlob = await (await fetch(image.uri)).blob();

            // PUT the image in the aws bucket
            await fetch(s3Url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/octet-stream",
                },
                body: imageBlob,
            });

            // Submit the file name to the server
            const response2 = await requestBackend("profiles/avatar", "POST", {}, {fileName}, token);

            if (response2.status === HttpStatusCode.OK) {
                const payload2 = (response2 as SuccessfulRequestResponse).data;
                const {avatar} = payload2 as AvatarSuccessfulUpdatedDto;
                dispatch(setAvatarSuccess(avatar));
            } else fail();
        } catch (error) {
            console.error(error);
            console.error("An unexpected error occured with a request to the avatar bucket.");
            fail();
        }
    } else fail();
};
