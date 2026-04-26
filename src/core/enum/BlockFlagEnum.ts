export enum BlockFlagEnum {
    NONE = 0,
    EXCHANGE = 1 << 0,
    PARTY_INVITE = 1 << 1,
    GUILD_INVITE = 1 << 2,
    WHISPER = 1 << 3,
    MESSENGER_INVITE = 1 << 4,
    PARTY_REQUEST = 1 << 5,
}
