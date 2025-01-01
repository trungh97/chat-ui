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
};

export type IResponse = {
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  googleLogin: UserGlobalResponse;
  loginCredentialBasedUser: UserGlobalResponse;
  logout: Scalars['Boolean']['output'];
  registerCredentialBasedUser: UserGlobalResponse;
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

export type PostDto = {
  __typename?: 'PostDTO';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type PostGlobalResponse = IResponse & {
  __typename?: 'PostGlobalResponse';
  data?: Maybe<PostDto>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['Float']['output']>;
};

export type Query = {
  __typename?: 'Query';
  findPostById: PostGlobalResponse;
  getUserById: UserGlobalResponse;
  me: UserGlobalResponse;
};


export type QueryFindPostByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['String']['input'];
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

export type UserResponseFragment = { __typename?: 'UserGlobalResponse', error?: string | null, statusCode?: number | null, message?: string | null, data?: { __typename?: 'UserDTO', id: string, firstName: string, lastName: string, email: string, phone?: string | null, role: UserRole, avatar: string, isActive: boolean, provider?: UserProvider | null, providerUserId?: string | null, status: UserStatus } | null };

type Status_PostGlobalResponse_Fragment = { __typename?: 'PostGlobalResponse', statusCode?: number | null, message?: string | null };

type Status_UserGlobalResponse_Fragment = { __typename?: 'UserGlobalResponse', statusCode?: number | null, message?: string | null };

export type StatusFragment = Status_PostGlobalResponse_Fragment | Status_UserGlobalResponse_Fragment;

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

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserGlobalResponse', error?: string | null, statusCode?: number | null, message?: string | null, data?: { __typename?: 'UserDTO', id: string, firstName: string, lastName: string, email: string, phone?: string | null, role: UserRole, avatar: string, isActive: boolean, provider?: UserProvider | null, providerUserId?: string | null, status: UserStatus } | null } };

export const StatusFragmentDoc = gql`
    fragment status on IResponse {
  statusCode
  message
}
    `;
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