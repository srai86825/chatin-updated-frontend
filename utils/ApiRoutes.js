

export const HOST_SERVER=process.env.NEXT_PUBLIC_HOST;

const AUTH_ROUTE=`${HOST_SERVER}/api/auth`
const MESSAGES_ROUTE=`${HOST_SERVER}/api/messages`

export const CHECK_USER_ROUTE=`${AUTH_ROUTE}/check-user`;
export const ONBOARD_USER_ROUTE=`${AUTH_ROUTE}/onboard`;
export const GET_ALL_USERS=`${AUTH_ROUTE}/get-all-users`;
export const GET_CALL_TOKEN=`${AUTH_ROUTE}/generate-token`;

export const ADD_MESSAGE_ROUTE=`${MESSAGES_ROUTE}/add-message`
export const GET_INTIAL_USERS_ROUTE=`${MESSAGES_ROUTE}/get-initial-users/`
export const GET_MESSAGES_ROUTE=`${MESSAGES_ROUTE}/get-messages`
export const ADD_IMAGE_MESSAGE_ROUTE=`${MESSAGES_ROUTE}/add-image-message`
export const ADD_AUDIO_MESSAGE_ROUTE=`${MESSAGES_ROUTE}/add-audio-message`
