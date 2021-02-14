export enum ReportType {
    VIOLENCE = "violence",
    NUDITY = "nudity",
    HARASSMENT = "harassment",
    UNDESIRABLE_CONTENT = "undesirable-content",
    HATE_SPEECH = "hate-speech",
    VULGAR_CONTENT = "vulgar-content",
    OTHER = "other",
}

export const REPORT_TYPES = [
    ReportType.VIOLENCE,
    ReportType.NUDITY,
    ReportType.HARASSMENT,
    ReportType.UNDESIRABLE_CONTENT,
    ReportType.HATE_SPEECH,
    ReportType.VULGAR_CONTENT,
    ReportType.OTHER,
];

export enum ReportEntityType {
    PROFILE_ENTITY = "ProfileEntity",
    POST_ENTITY = "PostEntity",
    COMMENT_ENTITY = "CommentEntity",
}
