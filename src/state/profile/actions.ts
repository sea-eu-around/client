import {
    AppThunk,
    CreateProfileSuccessAction,
    PROFILE_ACTION_TYPES,
    LoadProfileOffersSuccessAction,
    LoadProfileInterestsSuccessAction,
    SetProfileFieldsSuccessAction,
    FetchUserSuccessAction,
    SetAvatarSuccessAction,
    SetAvatarFailureAction,
} from "../types";
import {
    AvatarSuccessfulUpdatedDto,
    CreateProfileDto,
    InterestDto,
    OfferDto,
    RequestResponse,
    ResponseUserDto,
    SignedUrlResponseDto,
    SuccessfulRequestResponse,
} from "../../api/dto";
import {UserProfile} from "../../model/user-profile";
import {User} from "../../model/user";
import {requestBackend} from "../../api/utils";
import {convertDtoToUser, convertPartialProfileToCreateDto} from "../../api/converters";
import {ImageInfo} from "expo-image-picker/build/ImagePicker.types";
import {readCachedStaticData} from "../static-storage-middleware";
import {HttpStatusCode} from "../../constants/http-status";

export const setProfileFieldsSuccess = (fields: Partial<UserProfile>): SetProfileFieldsSuccessAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS_SUCCESS,
    fields,
});

export const setProfileFields = (fields: Partial<UserProfile>): AppThunk => async (dispatch) => {
    const dto: Partial<CreateProfileDto> = convertPartialProfileToCreateDto(fields);
    const response = await requestBackend("profiles", "PATCH", {}, dto, true);
    if (response.status === HttpStatusCode.OK) {
        dispatch(setProfileFieldsSuccess(fields));
    } else {
        console.log("error in setProfileFields");
    }
};

export const createProfileSuccess = (): CreateProfileSuccessAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS,
});

export const createProfile = (profile: CreateProfileDto): AppThunk => async (dispatch) => {
    const response = await requestBackend("profiles", "POST", {}, profile, true);
    if (response.status === HttpStatusCode.OK) dispatch(createProfileSuccess());
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

export const loadProfileOffersSuccess = (offers: OfferDto[], fromCache = false): LoadProfileOffersSuccessAction => ({
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

export const loadProfileInterestsSuccess = (
    interests: InterestDto[],
    fromCache = false,
): LoadProfileInterestsSuccessAction => ({
    type: PROFILE_ACTION_TYPES.LOAD_PROFILE_INTERESTS_SUCCESS,
    interests,
    fromCache,
});

export const fetchUser = (): AppThunk => async (dispatch) => {
    const response = await requestBackend("auth/me", "GET", {}, {}, true);
    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data;
        const user = convertDtoToUser(payload as ResponseUserDto);
        dispatch(fetchUserSuccess(user));
    }
};

export const fetchUserSuccess = (user: User): FetchUserSuccessAction => ({
    type: PROFILE_ACTION_TYPES.FETCH_USER_SUCCESS,
    user,
});

export const setAvatarSuccess = (avatarUrl: string): SetAvatarSuccessAction => ({
    type: PROFILE_ACTION_TYPES.SET_AVATAR_SUCCESS,
    avatarUrl,
});

export const setAvatarFailure = (): SetAvatarFailureAction => ({
    type: PROFILE_ACTION_TYPES.SET_AVATAR_FAILURE,
});

export const setAvatar = (image: ImageInfo): AppThunk => async (dispatch) => {
    const response = await requestBackend("common/signedUrl", "GET", {mimeType: "image/jpeg"}, {}, true);

    const fail = () => dispatch(setAvatarFailure());

    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data;
        const {fileName, s3Url} = payload as SignedUrlResponseDto;

        try {
            // Fetch the image from the device and convert it to a blob
            const imageBlob = await (await fetch(image.uri)).blob();

            // PUT the image in the aws bucket
            await fetch(s3Url, {
                method: "PUT",
                body: imageBlob,
            });

            // Submit the file name to the server
            const response2 = await requestBackend("profiles/avatar", "POST", {}, {fileName}, true);

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
