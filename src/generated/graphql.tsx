import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
};

export type ContactCreateMutationRequest = {
  contactId: Scalars['String']['input'];
};

export type ContactDto = {
  __typename?: 'ContactDTO';
  contactId: Scalars['String']['output'];
  contactName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  userId: Scalars['String']['output'];
};

export type ContactListResponse = IResponse & {
  __typename?: 'ContactListResponse';
  data?: Maybe<Array<ContactDto>>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

export type ContactResponse = IResponse & {
  __typename?: 'ContactResponse';
  data?: Maybe<ContactDto>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

export type ConversationCreateMutationRequest = {
  participants: Array<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ConversationDto = {
  __typename?: 'ConversationDTO';
  creatorId: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  groupAvatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isArchived: Scalars['Boolean']['output'];
  lastMessageAt?: Maybe<Scalars['DateTimeISO']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  type: ConversationType;
};

export type ConversationDeleteGlobalResponse = IResponse & {
  __typename?: 'ConversationDeleteGlobalResponse';
  data?: Maybe<Scalars['Boolean']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

export type ConversationGlobalResponse = IResponse & {
  __typename?: 'ConversationGlobalResponse';
  data?: Maybe<ConversationDto>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

/** Conversation type */
export enum ConversationType {
  Group = 'GROUP',
  Private = 'PRIVATE'
}

export type CursorBasedPaginationParams = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Float']['input'];
};

export type ExtendConversationDto = {
  __typename?: 'ExtendConversationDTO';
  creatorId: Scalars['String']['output'];
  defaultGroupAvatar?: Maybe<Array<Scalars['String']['output']>>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  groupAvatar?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isArchived: Scalars['Boolean']['output'];
  lastMessageAt?: Maybe<Scalars['DateTimeISO']['output']>;
  messages: Array<MessageDto>;
  participants: Array<ExtendedParticipantDto>;
  title?: Maybe<Scalars['String']['output']>;
  type: ConversationType;
};

export type ExtendConversationGlobalResponse = IResponse & {
  __typename?: 'ExtendConversationGlobalResponse';
  data?: Maybe<ExtendConversationDto>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

export type ExtendConversationListGlobalResponse = IResponse & {
  __typename?: 'ExtendConversationListGlobalResponse';
  data?: Maybe<PaginatedConversationListResponse>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

export type ExtendedParticipantDto = {
  __typename?: 'ExtendedParticipantDTO';
  avatar: Scalars['String']['output'];
  conversationId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type: ParticipantType;
  userId: Scalars['String']['output'];
};

export type FriendRequestCreateMutationRequest = {
  receiverId: Scalars['String']['input'];
};

export type FriendRequestDto = {
  __typename?: 'FriendRequestDTO';
  id: Scalars['ID']['output'];
  receiverId: Scalars['String']['output'];
  senderId: Scalars['String']['output'];
  status: FriendRequestStatus;
};

export type FriendRequestListResponse = IResponse & {
  __typename?: 'FriendRequestListResponse';
  data?: Maybe<Array<FriendRequestDto>>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

export type FriendRequestResponse = IResponse & {
  __typename?: 'FriendRequestResponse';
  data?: Maybe<FriendRequestDto>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

/** Friend request status */
export enum FriendRequestStatus {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING'
}

export type IResponse = {
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

export type MessageCreateMutationRequest = {
  content: Scalars['String']['input'];
  conversationId?: InputMaybe<Scalars['String']['input']>;
  extra?: InputMaybe<Scalars['String']['input']>;
  messageType: MessageType;
  receivers?: InputMaybe<Array<Scalars['String']['input']>>;
  replyToMessageId?: InputMaybe<Scalars['String']['input']>;
};

export type MessageDto = {
  __typename?: 'MessageDTO';
  content: Scalars['String']['output'];
  conversationId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  extra?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  messageType: MessageType;
  replyToMessageId?: Maybe<Scalars['String']['output']>;
  senderId: Scalars['String']['output'];
};

export type MessageListGlobalResponse = IResponse & {
  __typename?: 'MessageListGlobalResponse';
  data?: Maybe<PaginatedMessageListResponse>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

export type MessageResponse = IResponse & {
  __typename?: 'MessageResponse';
  data?: Maybe<MessageDto>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

/** Message type */
export enum MessageType {
  File = 'FILE',
  Image = 'IMAGE',
  System = 'SYSTEM',
  Text = 'TEXT',
  Video = 'VIDEO'
}

export type MessageWithSenderDto = {
  __typename?: 'MessageWithSenderDTO';
  content: Scalars['String']['output'];
  conversationId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  extra?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  messageType: MessageType;
  replyToMessageId?: Maybe<Scalars['String']['output']>;
  senderAvatar?: Maybe<Scalars['String']['output']>;
  senderId: Scalars['String']['output'];
  senderName?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeFriendRequestStatus: FriendRequestResponse;
  createContact: ContactResponse;
  createConversation: ConversationGlobalResponse;
  createFriendRequest: FriendRequestResponse;
  createMessage: MessageResponse;
  createParticipant: ParticipantResponse;
  deleteConversation: ConversationDeleteGlobalResponse;
  deleteFriendRequest: Scalars['Boolean']['output'];
  googleLogin: UserGlobalResponse;
  loginCredentialBasedUser: UserGlobalResponse;
  logout: Scalars['Boolean']['output'];
  registerCredentialBasedUser: UserGlobalResponse;
};


export type MutationChangeFriendRequestStatusArgs = {
  id: Scalars['String']['input'];
  status: FriendRequestStatus;
};


export type MutationCreateContactArgs = {
  request: ContactCreateMutationRequest;
};


export type MutationCreateConversationArgs = {
  conversation: ConversationCreateMutationRequest;
};


export type MutationCreateFriendRequestArgs = {
  request: FriendRequestCreateMutationRequest;
};


export type MutationCreateMessageArgs = {
  request: MessageCreateMutationRequest;
};


export type MutationCreateParticipantArgs = {
  request: ParticipantCreateMutationRequest;
};


export type MutationDeleteConversationArgs = {
  conversationId: Scalars['String']['input'];
};


export type MutationDeleteFriendRequestArgs = {
  id: Scalars['String']['input'];
};


export type MutationGoogleLoginArgs = {
  code: Scalars['String']['input'];
};


export type MutationLoginCredentialBasedUserArgs = {
  request: UserLoginInput;
};


export type MutationRegisterCredentialBasedUserArgs = {
  request: UserCreateMutationRequest;
};

export type PaginatedConversationListResponse = {
  __typename?: 'PaginatedConversationListResponse';
  items: Array<ExtendConversationDto>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginatedMessageListResponse = {
  __typename?: 'PaginatedMessageListResponse';
  items: Array<MessageWithSenderDto>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type ParticipantCreateMutationRequest = {
  conversationId: Scalars['String']['input'];
  type?: ParticipantType;
  userId: Scalars['String']['input'];
};

export type ParticipantDto = {
  __typename?: 'ParticipantDTO';
  conversationId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  type: ParticipantType;
  userId: Scalars['String']['output'];
};

export type ParticipantResponse = IResponse & {
  __typename?: 'ParticipantResponse';
  data?: Maybe<ParticipantDto>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

/** Participant type */
export enum ParticipantType {
  Admin = 'ADMIN',
  Member = 'MEMBER'
}

export type Query = {
  __typename?: 'Query';
  getContactsByUserId: ContactListResponse;
  getConversationById: ExtendConversationGlobalResponse;
  getFriendRequestById: FriendRequestResponse;
  getFriendRequestByUsers: FriendRequestResponse;
  getMessagesByConversationId: MessageListGlobalResponse;
  getMyConversations: ExtendConversationListGlobalResponse;
  getMyFriendRequests: FriendRequestListResponse;
  getUserById: UserGlobalResponse;
  me: UserGlobalResponse;
};


export type QueryGetConversationByIdArgs = {
  conversationId: Scalars['String']['input'];
};


export type QueryGetFriendRequestByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetFriendRequestByUsersArgs = {
  receiverId: Scalars['String']['input'];
  senderId: Scalars['String']['input'];
};


export type QueryGetMessagesByConversationIdArgs = {
  conversationId: Scalars['String']['input'];
  options: CursorBasedPaginationParams;
};


export type QueryGetMyConversationsArgs = {
  options: CursorBasedPaginationParams;
};


export type QueryGetUserByIdArgs = {
  id: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessageAdded: MessageWithSenderDto;
};

export type UserCreateMutationRequest = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type UserDto = {
  __typename?: 'UserDTO';
  avatar: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<UserProvider>;
  providerUserId?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  status: UserStatus;
};

export type UserGlobalResponse = IResponse & {
  __typename?: 'UserGlobalResponse';
  data?: Maybe<UserDto>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

export type UserLoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** User provider */
export enum UserProvider {
  Facebook = 'FACEBOOK',
  Google = 'GOOGLE'
}

/** User role */
export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

/** User status */
export enum UserStatus {
  Busy = 'BUSY',
  Offline = 'OFFLINE',
  Online = 'ONLINE'
}

export type ConversationFragment = { __typename?: 'ConversationDTO', id: string, title?: string | null, creatorId: string, isArchived: boolean, deletedAt?: any | null, type: ConversationType, groupAvatar?: string | null };

export type ExtendedConversationFragment = { __typename?: 'ExtendConversationDTO', id: string, title?: string | null, creatorId: string, isArchived: boolean, deletedAt?: any | null, type: ConversationType, groupAvatar?: string | null, defaultGroupAvatar?: Array<string> | null, participants: Array<{ __typename?: 'ExtendedParticipantDTO', id: string, conversationId: string, userId: string, type: ParticipantType, name: string, avatar: string }>, messages: Array<{ __typename?: 'MessageDTO', id: string, content: string, messageType: MessageType, senderId: string, extra?: string | null, conversationId: string, replyToMessageId?: string | null, createdAt: any }> };

export type MessageFragment = { __typename?: 'MessageDTO', id: string, content: string, messageType: MessageType, senderId: string, extra?: string | null, conversationId: string, replyToMessageId?: string | null, createdAt: any };

export type MessageWithSenderFragment = { __typename?: 'MessageWithSenderDTO', id: string, content: string, messageType: MessageType, senderId: string, extra?: string | null, conversationId: string, replyToMessageId?: string | null, createdAt: any, senderName?: string | null, senderAvatar?: string | null };

export type ParticipantFragment = { __typename?: 'ParticipantDTO', id: string, conversationId: string, userId: string, type: ParticipantType };

export type ExtendedParticipantFragment = { __typename?: 'ExtendedParticipantDTO', id: string, conversationId: string, userId: string, type: ParticipantType, name: string, avatar: string };

export type ConversationListResponseFragment = { __typename?: 'ExtendConversationListGlobalResponse', error?: string | null, statusCode?: number | null, message?: string | null, data?: { __typename?: 'PaginatedConversationListResponse', nextCursor?: string | null, items: Array<{ __typename?: 'ExtendConversationDTO', id: string, title?: string | null, creatorId: string, isArchived: boolean, deletedAt?: any | null, type: ConversationType, groupAvatar?: string | null, defaultGroupAvatar?: Array<string> | null, participants: Array<{ __typename?: 'ExtendedParticipantDTO', id: string, conversationId: string, userId: string, type: ParticipantType, name: string, avatar: string }>, messages: Array<{ __typename?: 'MessageDTO', id: string, content: string, messageType: MessageType, senderId: string, extra?: string | null, conversationId: string, replyToMessageId?: string | null, createdAt: any }> }> } | null };

export type MessageListResponseFragment = { __typename?: 'MessageListGlobalResponse', error?: string | null, statusCode?: number | null, message?: string | null, data?: { __typename?: 'PaginatedMessageListResponse', nextCursor?: string | null, items: Array<{ __typename?: 'MessageWithSenderDTO', id: string, content: string, messageType: MessageType, senderId: string, extra?: string | null, conversationId: string, replyToMessageId?: string | null, createdAt: any, senderName?: string | null, senderAvatar?: string | null }> } | null };

export type UserResponseFragment = { __typename?: 'UserGlobalResponse', error?: string | null, statusCode?: number | null, message?: string | null, data?: { __typename?: 'UserDTO', id: string, firstName: string, lastName: string, email: string, phone?: string | null, role: UserRole, avatar: string, isActive: boolean, provider?: UserProvider | null, providerUserId?: string | null, status: UserStatus } | null };

type Status_ContactListResponse_Fragment = { __typename?: 'ContactListResponse', statusCode?: number | null, message?: string | null };

type Status_ContactResponse_Fragment = { __typename?: 'ContactResponse', statusCode?: number | null, message?: string | null };

type Status_ConversationDeleteGlobalResponse_Fragment = { __typename?: 'ConversationDeleteGlobalResponse', statusCode?: number | null, message?: string | null };

type Status_ConversationGlobalResponse_Fragment = { __typename?: 'ConversationGlobalResponse', statusCode?: number | null, message?: string | null };

type Status_ExtendConversationGlobalResponse_Fragment = { __typename?: 'ExtendConversationGlobalResponse', statusCode?: number | null, message?: string | null };

type Status_ExtendConversationListGlobalResponse_Fragment = { __typename?: 'ExtendConversationListGlobalResponse', statusCode?: number | null, message?: string | null };

type Status_FriendRequestListResponse_Fragment = { __typename?: 'FriendRequestListResponse', statusCode?: number | null, message?: string | null };

type Status_FriendRequestResponse_Fragment = { __typename?: 'FriendRequestResponse', statusCode?: number | null, message?: string | null };

type Status_MessageListGlobalResponse_Fragment = { __typename?: 'MessageListGlobalResponse', statusCode?: number | null, message?: string | null };

type Status_MessageResponse_Fragment = { __typename?: 'MessageResponse', statusCode?: number | null, message?: string | null };

type Status_ParticipantResponse_Fragment = { __typename?: 'ParticipantResponse', statusCode?: number | null, message?: string | null };

type Status_UserGlobalResponse_Fragment = { __typename?: 'UserGlobalResponse', statusCode?: number | null, message?: string | null };

export type StatusFragment = Status_ContactListResponse_Fragment | Status_ContactResponse_Fragment | Status_ConversationDeleteGlobalResponse_Fragment | Status_ConversationGlobalResponse_Fragment | Status_ExtendConversationGlobalResponse_Fragment | Status_ExtendConversationListGlobalResponse_Fragment | Status_FriendRequestListResponse_Fragment | Status_FriendRequestResponse_Fragment | Status_MessageListGlobalResponse_Fragment | Status_MessageResponse_Fragment | Status_ParticipantResponse_Fragment | Status_UserGlobalResponse_Fragment;

export type UserInfoFragment = { __typename?: 'UserDTO', id: string, firstName: string, lastName: string, email: string, phone?: string | null, role: UserRole, avatar: string, isActive: boolean, provider?: UserProvider | null, providerUserId?: string | null, status: UserStatus };

export type CredentialBasedLoginMutationVariables = Exact<{
  request: UserLoginInput;
}>;


export type CredentialBasedLoginMutation = { __typename?: 'Mutation', loginCredentialBasedUser: { __typename?: 'UserGlobalResponse', error?: string | null, statusCode?: number | null, message?: string | null, data?: { __typename?: 'UserDTO', id: string, firstName: string, lastName: string, email: string, phone?: string | null, role: UserRole, avatar: string, isActive: boolean, provider?: UserProvider | null, providerUserId?: string | null, status: UserStatus } | null } };

export type GoogleLoginMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type GoogleLoginMutation = { __typename?: 'Mutation', googleLogin: { __typename?: 'UserGlobalResponse', error?: string | null, statusCode?: number | null, message?: string | null, data?: { __typename?: 'UserDTO', id: string, firstName: string, lastName: string, email: string, phone?: string | null, role: UserRole, avatar: string, isActive: boolean, provider?: UserProvider | null, providerUserId?: string | null, status: UserStatus } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type GetMessagesByConversationIdQueryVariables = Exact<{
  conversationId: Scalars['String']['input'];
  options: CursorBasedPaginationParams;
}>;


export type GetMessagesByConversationIdQuery = { __typename?: 'Query', getMessagesByConversationId: { __typename?: 'MessageListGlobalResponse', error?: string | null, statusCode?: number | null, message?: string | null, data?: { __typename?: 'PaginatedMessageListResponse', nextCursor?: string | null, items: Array<{ __typename?: 'MessageWithSenderDTO', id: string, content: string, messageType: MessageType, senderId: string, extra?: string | null, conversationId: string, replyToMessageId?: string | null, createdAt: any, senderName?: string | null, senderAvatar?: string | null }> } | null } };

export type GetMyLatestConversationsQueryVariables = Exact<{
  options: CursorBasedPaginationParams;
}>;


export type GetMyLatestConversationsQuery = { __typename?: 'Query', getMyConversations: { __typename?: 'ExtendConversationListGlobalResponse', error?: string | null, statusCode?: number | null, message?: string | null, data?: { __typename?: 'PaginatedConversationListResponse', nextCursor?: string | null, items: Array<{ __typename?: 'ExtendConversationDTO', id: string, title?: string | null, creatorId: string, isArchived: boolean, deletedAt?: any | null, type: ConversationType, groupAvatar?: string | null, defaultGroupAvatar?: Array<string> | null, participants: Array<{ __typename?: 'ExtendedParticipantDTO', id: string, conversationId: string, userId: string, type: ParticipantType, name: string, avatar: string }>, messages: Array<{ __typename?: 'MessageDTO', id: string, content: string, messageType: MessageType, senderId: string, extra?: string | null, conversationId: string, replyToMessageId?: string | null, createdAt: any }> }> } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserGlobalResponse', error?: string | null, statusCode?: number | null, message?: string | null, data?: { __typename?: 'UserDTO', id: string, firstName: string, lastName: string, email: string, phone?: string | null, role: UserRole, avatar: string, isActive: boolean, provider?: UserProvider | null, providerUserId?: string | null, status: UserStatus } | null } };

export type NewMessageAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewMessageAddedSubscription = { __typename?: 'Subscription', newMessageAdded: { __typename?: 'MessageWithSenderDTO', id: string, content: string, messageType: MessageType, senderId: string, extra?: string | null, conversationId: string, replyToMessageId?: string | null, createdAt: any, senderName?: string | null, senderAvatar?: string | null } };

export const ConversationFragmentDoc = gql`
    fragment conversation on ConversationDTO {
  id
  title
  creatorId
  isArchived
  deletedAt
  type
  groupAvatar
}
    `;
export const ParticipantFragmentDoc = gql`
    fragment participant on ParticipantDTO {
  id
  conversationId
  userId
  type
}
    `;
export const StatusFragmentDoc = gql`
    fragment status on IResponse {
  statusCode
  message
}
    `;
export const ExtendedParticipantFragmentDoc = gql`
    fragment extendedParticipant on ExtendedParticipantDTO {
  id
  conversationId
  userId
  type
  name
  avatar
}
    `;
export const MessageFragmentDoc = gql`
    fragment message on MessageDTO {
  id
  content
  messageType
  senderId
  extra
  conversationId
  replyToMessageId
  createdAt
}
    `;
export const ExtendedConversationFragmentDoc = gql`
    fragment extendedConversation on ExtendConversationDTO {
  id
  title
  creatorId
  isArchived
  deletedAt
  type
  groupAvatar
  defaultGroupAvatar
  participants {
    ...extendedParticipant
  }
  messages {
    ...message
  }
}
    ${ExtendedParticipantFragmentDoc}
${MessageFragmentDoc}`;
export const ConversationListResponseFragmentDoc = gql`
    fragment conversationListResponse on ExtendConversationListGlobalResponse {
  ...status
  data {
    items {
      ...extendedConversation
    }
    nextCursor
  }
  error
}
    ${StatusFragmentDoc}
${ExtendedConversationFragmentDoc}`;
export const MessageWithSenderFragmentDoc = gql`
    fragment messageWithSender on MessageWithSenderDTO {
  id
  content
  messageType
  senderId
  extra
  conversationId
  replyToMessageId
  createdAt
  senderName
  senderAvatar
}
    `;
export const MessageListResponseFragmentDoc = gql`
    fragment messageListResponse on MessageListGlobalResponse {
  ...status
  data {
    items {
      ...messageWithSender
    }
    nextCursor
  }
  error
}
    ${StatusFragmentDoc}
${MessageWithSenderFragmentDoc}`;
export const UserInfoFragmentDoc = gql`
    fragment userInfo on UserDTO {
  id
  firstName
  lastName
  email
  phone
  role
  avatar
  isActive
  provider
  providerUserId
  status
}
    `;
export const UserResponseFragmentDoc = gql`
    fragment userResponse on UserGlobalResponse {
  ...status
  data {
    ...userInfo
  }
  error
}
    ${StatusFragmentDoc}
${UserInfoFragmentDoc}`;
export const CredentialBasedLoginDocument = gql`
    mutation CredentialBasedLogin($request: UserLoginInput!) {
  loginCredentialBasedUser(request: $request) {
    ...userResponse
  }
}
    ${UserResponseFragmentDoc}`;
export type CredentialBasedLoginMutationFn = Apollo.MutationFunction<CredentialBasedLoginMutation, CredentialBasedLoginMutationVariables>;

/**
 * __useCredentialBasedLoginMutation__
 *
 * To run a mutation, you first call `useCredentialBasedLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCredentialBasedLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [credentialBasedLoginMutation, { data, loading, error }] = useCredentialBasedLoginMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCredentialBasedLoginMutation(baseOptions?: Apollo.MutationHookOptions<CredentialBasedLoginMutation, CredentialBasedLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CredentialBasedLoginMutation, CredentialBasedLoginMutationVariables>(CredentialBasedLoginDocument, options);
      }
export type CredentialBasedLoginMutationHookResult = ReturnType<typeof useCredentialBasedLoginMutation>;
export type CredentialBasedLoginMutationResult = Apollo.MutationResult<CredentialBasedLoginMutation>;
export type CredentialBasedLoginMutationOptions = Apollo.BaseMutationOptions<CredentialBasedLoginMutation, CredentialBasedLoginMutationVariables>;
export const GoogleLoginDocument = gql`
    mutation GoogleLogin($code: String!) {
  googleLogin(code: $code) {
    ...userResponse
  }
}
    ${UserResponseFragmentDoc}`;
export type GoogleLoginMutationFn = Apollo.MutationFunction<GoogleLoginMutation, GoogleLoginMutationVariables>;

/**
 * __useGoogleLoginMutation__
 *
 * To run a mutation, you first call `useGoogleLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoogleLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [googleLoginMutation, { data, loading, error }] = useGoogleLoginMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useGoogleLoginMutation(baseOptions?: Apollo.MutationHookOptions<GoogleLoginMutation, GoogleLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GoogleLoginMutation, GoogleLoginMutationVariables>(GoogleLoginDocument, options);
      }
export type GoogleLoginMutationHookResult = ReturnType<typeof useGoogleLoginMutation>;
export type GoogleLoginMutationResult = Apollo.MutationResult<GoogleLoginMutation>;
export type GoogleLoginMutationOptions = Apollo.BaseMutationOptions<GoogleLoginMutation, GoogleLoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const GetMessagesByConversationIdDocument = gql`
    query GetMessagesByConversationId($conversationId: String!, $options: CursorBasedPaginationParams!) {
  getMessagesByConversationId(conversationId: $conversationId, options: $options) {
    ...messageListResponse
  }
}
    ${MessageListResponseFragmentDoc}`;

/**
 * __useGetMessagesByConversationIdQuery__
 *
 * To run a query within a React component, call `useGetMessagesByConversationIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesByConversationIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesByConversationIdQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      options: // value for 'options'
 *   },
 * });
 */
export function useGetMessagesByConversationIdQuery(baseOptions: Apollo.QueryHookOptions<GetMessagesByConversationIdQuery, GetMessagesByConversationIdQueryVariables> & ({ variables: GetMessagesByConversationIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMessagesByConversationIdQuery, GetMessagesByConversationIdQueryVariables>(GetMessagesByConversationIdDocument, options);
      }
export function useGetMessagesByConversationIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMessagesByConversationIdQuery, GetMessagesByConversationIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMessagesByConversationIdQuery, GetMessagesByConversationIdQueryVariables>(GetMessagesByConversationIdDocument, options);
        }
export function useGetMessagesByConversationIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMessagesByConversationIdQuery, GetMessagesByConversationIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMessagesByConversationIdQuery, GetMessagesByConversationIdQueryVariables>(GetMessagesByConversationIdDocument, options);
        }
export type GetMessagesByConversationIdQueryHookResult = ReturnType<typeof useGetMessagesByConversationIdQuery>;
export type GetMessagesByConversationIdLazyQueryHookResult = ReturnType<typeof useGetMessagesByConversationIdLazyQuery>;
export type GetMessagesByConversationIdSuspenseQueryHookResult = ReturnType<typeof useGetMessagesByConversationIdSuspenseQuery>;
export type GetMessagesByConversationIdQueryResult = Apollo.QueryResult<GetMessagesByConversationIdQuery, GetMessagesByConversationIdQueryVariables>;
export const GetMyLatestConversationsDocument = gql`
    query GetMyLatestConversations($options: CursorBasedPaginationParams!) {
  getMyConversations(options: $options) {
    ...conversationListResponse
  }
}
    ${ConversationListResponseFragmentDoc}`;

/**
 * __useGetMyLatestConversationsQuery__
 *
 * To run a query within a React component, call `useGetMyLatestConversationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyLatestConversationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyLatestConversationsQuery({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useGetMyLatestConversationsQuery(baseOptions: Apollo.QueryHookOptions<GetMyLatestConversationsQuery, GetMyLatestConversationsQueryVariables> & ({ variables: GetMyLatestConversationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyLatestConversationsQuery, GetMyLatestConversationsQueryVariables>(GetMyLatestConversationsDocument, options);
      }
export function useGetMyLatestConversationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyLatestConversationsQuery, GetMyLatestConversationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyLatestConversationsQuery, GetMyLatestConversationsQueryVariables>(GetMyLatestConversationsDocument, options);
        }
export function useGetMyLatestConversationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyLatestConversationsQuery, GetMyLatestConversationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyLatestConversationsQuery, GetMyLatestConversationsQueryVariables>(GetMyLatestConversationsDocument, options);
        }
export type GetMyLatestConversationsQueryHookResult = ReturnType<typeof useGetMyLatestConversationsQuery>;
export type GetMyLatestConversationsLazyQueryHookResult = ReturnType<typeof useGetMyLatestConversationsLazyQuery>;
export type GetMyLatestConversationsSuspenseQueryHookResult = ReturnType<typeof useGetMyLatestConversationsSuspenseQuery>;
export type GetMyLatestConversationsQueryResult = Apollo.QueryResult<GetMyLatestConversationsQuery, GetMyLatestConversationsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...status
    data {
      ...userInfo
    }
    error
  }
}
    ${StatusFragmentDoc}
${UserInfoFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const NewMessageAddedDocument = gql`
    subscription NewMessageAdded {
  newMessageAdded {
    ...messageWithSender
  }
}
    ${MessageWithSenderFragmentDoc}`;

/**
 * __useNewMessageAddedSubscription__
 *
 * To run a query within a React component, call `useNewMessageAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewMessageAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewMessageAddedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNewMessageAddedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NewMessageAddedSubscription, NewMessageAddedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewMessageAddedSubscription, NewMessageAddedSubscriptionVariables>(NewMessageAddedDocument, options);
      }
export type NewMessageAddedSubscriptionHookResult = ReturnType<typeof useNewMessageAddedSubscription>;
export type NewMessageAddedSubscriptionResult = Apollo.SubscriptionResult<NewMessageAddedSubscription>;