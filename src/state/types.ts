import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {Action, AnyAction} from "redux";
import {
    InterestDto,
    OfferCategory,
    OfferDto,
    OfferValueDto,
    RemoteValidationErrors,
    SpokenLanguageDto,
    TokenDto,
} from "../api/dto";
import {UserProfile} from "../model/user-profile";
import {User} from "../model/user";
import {Degree, Gender, Role, StaffRole} from "../constants/profile-constants";
import {CountryCode} from "../model/country-codes";
import {ChatRoom, ChatRoomUser} from "../model/chat-room";
import {UserSettings} from "../model/user-settings";
import {MatchHistoryItem} from "../model/matching";
import {Group} from "../model/groups";

export type FailableActionReturn = {success: boolean; errors?: string[]};
export type FailableThunkAction = AppThunk<Promise<FailableActionReturn>>;
export type ValidatedActionReturn = {success: boolean; errors?: RemoteValidationErrors};
export type ValidatedThunkAction = AppThunk<Promise<ValidatedActionReturn>>;

export type PaginatedState = {page: number; canFetchMore: boolean; fetching: boolean};
export const initialPaginatedState = (): PaginatedState => ({page: 1, canFetchMore: true, fetching: false});

export type OnboardingState = {
    firstname: string;
    lastname: string;
    birthdate: Date | null;
    gender: Gender | null;
    nationality: CountryCode | null;
    type: Role | null;
    degree: Degree | null;
    staffRoles: {[key: string]: boolean};
    languages: SpokenLanguageDto[];
    interestIds: string[];
    offerValues: {[key: string]: OfferValueDto};
    educationFields: string[];
};

export type AuthState = {
    authenticated: boolean;
    validated: boolean;
    token: null | TokenDto;
    registerEmail: string;
    validatedEmail: string | null;
    accountNeedsRecovery: boolean;
    // This is available only in DEBUG_MODE on the staging server
    verificationToken?: string;
    onboarded: boolean;
    onboarding: OnboardingState;
    onboardingIndex: number;
};

export type SettingsState = {
    userSettings: UserSettings;
    localizedLanguageItems: {value: string; label: string}[];
    previousVersion: string | null;
    isFirstLaunch: boolean;
};

export type ProfileState = {
    user: User | null;
    offers: OfferDto[];
    offerIdToCategory: Map<string, OfferCategory>;
    interests: InterestDto[];
};

export type MatchingFiltersState = {
    offers: {[key: string]: boolean};
    universities: string[];
    degrees: Degree[];
    languages: string[];
    educationFields: string[];
    staffRoles: StaffRole[];
    types: Role[];
};

export type MatchingState = {
    filters: MatchingFiltersState;
    fetchedProfiles: UserProfile[];
    profilesPagination: PaginatedState;
    historyPagination: PaginatedState;
    historyFilters: {[key: string]: boolean};
    historyItems: MatchHistoryItem[];
    myMatches: UserProfile[];
    fetchingMyMatches: boolean;
};

export type MessagingState = {
    socketState: {connecting: boolean; connected: boolean};
    matchRooms: {[key: string]: ChatRoom}; // store by id for faster access
    matchRoomsOrdered: string[];
    matchRoomsPagination: PaginatedState;
    activeRoom: ChatRoom | null;
    localChatUser: ChatRoomUser | null;
    fetchingNewMessages: boolean;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type NotificationsState = {};

// eslint-disable-next-line @typescript-eslint/ban-types
export type ReportsState = {};

export type GroupsState = {
    groupsDict: {[key: string]: Group};
    pagination: PaginatedState;
    groups: Group[];
    myGroupsPagination: PaginatedState;
    myGroups: Group[];
};

export type AppState = {
    auth: AuthState;
    settings: SettingsState;
    profile: ProfileState;
    matching: MatchingState;
    messaging: MessagingState;
    notifications: NotificationsState;
    reports: ReportsState;
    groups: GroupsState;
};

// Shortcut type for redux-thunk actions (async actions)
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

// Shortcut type for redux-thunk dispatch (cast dispatch function to this for async actions)
export type MyThunkDispatch = ThunkDispatch<AppState, void, AnyAction>;
