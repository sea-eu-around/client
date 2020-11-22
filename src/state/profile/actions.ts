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
    ResponseUserDto,
    SignedUrlResponseDto,
} from "../../api/dto";
import {UserProfile} from "../../model/user-profile";
import {User} from "../../model/user";
import {requestBackend} from "../../api/utils";
import {convertDtoToUser, convertPartialProfileToCreateDto} from "../../api/converters";
import {ImageInfo} from "expo-image-picker/build/ImagePicker.types";
import {readCachedStaticData} from "../static-storage-middleware";

export const setProfileFieldsSuccess = (fields: Partial<UserProfile>): SetProfileFieldsSuccessAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_SET_FIELDS_SUCCESS,
    fields,
});

export const setProfileFields = (fields: Partial<UserProfile>): AppThunk => async (dispatch) => {
    const dto: Partial<CreateProfileDto> = convertPartialProfileToCreateDto(fields);
    const response = await requestBackend("profiles", "PATCH", {}, dto, true, true);
    if (response.success) {
        dispatch(setProfileFieldsSuccess(fields));
    } else {
        console.log("error in setProfileFields");
    }
};

export const createProfileSuccess = (): CreateProfileSuccessAction => ({
    type: PROFILE_ACTION_TYPES.PROFILE_CREATE_SUCCESS,
});

export const createProfile = (profile: CreateProfileDto): AppThunk => async (dispatch) => {
    const response = await requestBackend("profiles", "POST", {}, profile, true, true);
    if (response.success) dispatch(createProfileSuccess());
};

export const loadProfileOffers = (): AppThunk => async (dispatch) => {
    const fromCache = await readCachedStaticData<OfferDto[]>("offers");

    if (fromCache) {
        // If we already have the data in cache, we send the request in case an update is needed, but we're not awaiting for it
        requestBackend("offers", "GET", {updatedAt: fromCache.updatedAt}).then((response) => {
            const offers = response.data as OfferDto[];
            if (response.success) dispatch(loadProfileOffersSuccess(offers.length == 0 ? fromCache.data : offers));
        });
    } else {
        const response = await requestBackend("offers", "GET");
        if (response.success) dispatch(loadProfileOffersSuccess(response.data as OfferDto[]));
    }
};

export const loadProfileOffersSuccess = (offers: OfferDto[]): LoadProfileOffersSuccessAction => ({
    type: PROFILE_ACTION_TYPES.LOAD_PROFILE_OFFERS_SUCCESS,
    offers,
});

export const loadProfileInterests = (): AppThunk => async (dispatch) => {
    const fromCache = await readCachedStaticData<InterestDto[]>("interests");

    if (fromCache) {
        // If we already have the data in cache, we send the request in case an update is needed, but we're not awaiting for it
        requestBackend("interests", "GET", {updatedAt: fromCache.updatedAt}).then((response) => {
            const interests = response.data as InterestDto[];
            if (response.success)
                dispatch(loadProfileInterestsSuccess(interests.length == 0 ? fromCache.data : interests));
        });
    } else {
        const response = await requestBackend("interests", "GET");
        if (response.success) dispatch(loadProfileInterestsSuccess(response.data as InterestDto[]));
    }
};

export const loadProfileInterestsSuccess = (interests: InterestDto[]): LoadProfileInterestsSuccessAction => ({
    type: PROFILE_ACTION_TYPES.LOAD_PROFILE_INTERESTS_SUCCESS,
    interests,
});

export const fetchUser = (): AppThunk => async (dispatch) => {
    const response = await requestBackend("auth/me", "GET", {}, {}, true, true);
    if (response.success) {
        const dto = response.data as ResponseUserDto;
        dispatch(fetchUserSuccess(convertDtoToUser(dto)));
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
    const response = await requestBackend("common/signedUrl", "GET", {mimeType: "image/jpeg"}, {}, true, true);

    const fail = () => dispatch(setAvatarFailure());

    if (response.success) {
        const dto = response.data as SignedUrlResponseDto;
        const fileName = dto.fileName;
        const url = dto.s3Url;

        try {
            // Fetch the image from the device and convert it to a blob
            const imageBlob = await (await fetch(image.uri)).blob();

            // PUT the image in the aws bucket
            await fetch(url, {
                method: "PUT",
                body: imageBlob,
            });

            // Submit the file name to the server
            const response2 = await requestBackend("profiles/avatar", "POST", {}, {fileName}, true, true);

            if (response2.success) {
                const {avatar} = response2.data as AvatarSuccessfulUpdatedDto;
                dispatch(setAvatarSuccess(avatar));
            } else fail();
        } catch (error) {
            console.error(error);
            console.error("An unexpected error occured with a request to the avatar bucket.");
            fail();
        }
    } else fail();
};
